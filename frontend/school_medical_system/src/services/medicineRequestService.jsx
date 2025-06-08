import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Create context
const MedicineRequestContext = createContext();

// Custom hook for using the medicine request service
export const useMedicineRequest = () => {
    const context = useContext(MedicineRequestContext);
    if (!context) {
        throw new Error('useMedicineRequest must be used within a MedicineRequestProvider');
    }
    return context;
};

// Provider component
export const MedicineRequestProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRequest = useCallback(async (formData) => {
        try {
            setLoading(true);
            setError(null);

            const form = new FormData();
            form.append('studentId', formData.studentId);
            form.append('medicineName', formData.medicineName);
            form.append('dosage', formData.dosage);
            form.append('startDate', formData.startDate);
            form.append('endDate', formData.endDate);
            formData.timeOfDay.forEach(time => form.append('timeOfDay', time));
            if (formData.specialInstructions) {
                form.append('specialInstructions', formData.specialInstructions);
            }
            if (formData.prescriptionImage) {
                form.append('prescriptionImage', formData.prescriptionImage);
            }

            const response = await axios.post(`${API_URL}/medicine-requests`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.isSuccess) {
                toast.success('Medicine request created successfully');
                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to create medicine request');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getRequestsByStudent = useCallback(async (studentId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${API_URL}/medicine-requests/student/${studentId}`);
            
            if (response.data.isSuccess) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch medicine requests');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateRequestStatus = useCallback(async (requestId, status) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.put(`${API_URL}/medicine-requests/${requestId}/status?status=${status}`);
            
            if (response.data.isSuccess) {
                toast.success('Medicine request status updated successfully');
                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to update request status');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteRequest = useCallback(async (requestId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.delete(`${API_URL}/medicine-requests/${requestId}`);
            
            if (response.data.isSuccess) {
                toast.success('Medicine request deleted successfully');
                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to delete medicine request');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        loading,
        error,
        createRequest,
        getRequestsByStudent,
        updateRequestStatus,
        deleteRequest
    };

    return (
        <MedicineRequestContext.Provider value={value}>
            {children}
        </MedicineRequestContext.Provider>
    );
};

// Export the context for direct usage if needed
export { MedicineRequestContext }; 