import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';
import { handleApiError } from '../../utils/api.helper';


export const medicalService = {
  // Create a new medication
  createMedication: async (medicationData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.MEDICATION_ENDPOINTS.CREATE, medicationData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get all medications
  getAllMedications: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MEDICATION_ENDPOINTS.GET_ALL);
      // Return the data array from the response
      return response.data?.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default medicalService;
