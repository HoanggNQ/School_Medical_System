import React, { useState } from 'react';
import { useMedicineRequest } from '../../../services/medicineRequestService';

const MedicineRequestForm = ({ studentId, onSubmit }) => {
  const { loading } = useMedicineRequest();
  const [formData, setFormData] = useState({
    studentId: studentId,
    medicineName: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    timeOfDay: [],
    specialInstructions: '',
    prescriptionImage: null
  });

  const timeOptions = [
    'Before Breakfast',
    'After Breakfast',
    'Before Lunch',
    'After Lunch',
    'Before Dinner',
    'After Dinner',
    'Bedtime'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeChange = (time) => {
    setFormData(prev => ({
      ...prev,
      timeOfDay: prev.timeOfDay.includes(time)
        ? prev.timeOfDay.filter(t => t !== time)
        : [...prev.timeOfDay, time]
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        prescriptionImage: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Medicine Request Form</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Medicine Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medicine Name
            </label>
            <input
              type="text"
              name="medicineName"
              value={formData.medicineName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dosage
            </label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleInputChange}
              placeholder="e.g., 5ml, 1 tablet"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Time of Day */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time of Day
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {timeOptions.map(time => (
              <label key={time} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.timeOfDay.includes(time)}
                  onChange={() => handleTimeChange(time)}
                  className="rounded text-blue-500 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">{time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions
          </label>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Any special instructions for administering the medicine..."
            disabled={loading}
          />
        </div>

        {/* Prescription Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Prescription (if any)
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleImageUpload}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Accepted formats: Images (PNG, JPG) or PDF
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-6 py-2 rounded-md transition-colors duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicineRequestForm; 