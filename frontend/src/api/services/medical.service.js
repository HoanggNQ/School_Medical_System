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

  // Get medications with pagination
  getMedications: async ({ page = 0, size = 10, sort = 'medicationName,ASC' } = {}) => {
    try {
      const params = { page, size, sort };
      const response = await axiosInstance.get('api/v1/medications', { params });
      // Trả về nguyên response.data để lấy cả thông tin phân trang
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default medicalService;
