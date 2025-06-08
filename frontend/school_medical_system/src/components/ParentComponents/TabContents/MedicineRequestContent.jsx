import React, { useState, useEffect } from 'react';
import MedicineRequestForm from '../MedicineRequest/MedicineRequestForm';
import { useMedicineRequest } from '../../../services/medicineRequestService';

const MedicineRequestContent = ({ studentId }) => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { loading, error, createRequest, getRequestsByStudent, deleteRequest } = useMedicineRequest();

  useEffect(() => {
    fetchRequests();
  }, [studentId]);

  const fetchRequests = async () => {
    try {
      const response = await getRequestsByStudent(studentId);
      if (response.isSuccess) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await createRequest(formData);
      if (response.isSuccess) {
        setRequests(prev => [response.data, ...prev]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const response = await deleteRequest(requestId);
      if (response.isSuccess) {
        setRequests(prev => prev.filter(req => req.id !== requestId));
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Medicine Requests</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          {showForm ? 'Cancel Request' : 'New Request'}
        </button>
      </div>

      {showForm ? (
        <MedicineRequestForm
          studentId={studentId}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Requests</h3>
              {requests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No medicine requests yet</p>
              ) : (
                <div className="space-y-4">
                  {requests.map(request => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{request.medicineName}</h4>
                          <p className="text-sm text-gray-500">
                            Submitted on {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          {request.status === 'PENDING' && (
                            <button
                              onClick={() => handleDelete(request.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Dosage:</p>
                          <p className="font-medium">{request.dosage}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration:</p>
                          <p className="font-medium">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Time of Day:</p>
                          <p className="font-medium">{request.timeOfDay.join(', ')}</p>
                        </div>
                        {request.specialInstructions && (
                          <div className="col-span-2">
                            <p className="text-gray-600">Special Instructions:</p>
                            <p className="font-medium">{request.specialInstructions}</p>
                          </div>
                        )}
                        {request.prescriptionImageUrl && (
                          <div className="col-span-2">
                            <p className="text-gray-600">Prescription:</p>
                            <a
                              href={`${import.meta.env.VITE_API_URL}/uploads/${request.prescriptionImageUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              View Prescription
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineRequestContent; 