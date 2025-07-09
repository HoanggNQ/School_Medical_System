import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';
import { handleApiError } from '../../utils/api.helper';


export const vaccinationService = {
    // Create a new medication
    createVaccination: async (vaccinationData) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.VACCINATION_ENDPOINTS.CREATE, vaccinationData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    getVaccinationById: async (vaccinationId) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.VACCINATION_ENDPOINTS.GET_BY_ID(vaccinationId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    // Get all medications
    getAllVaccinations: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.VACCINATION_ENDPOINTS.GET_ALL);
            // Return the data array from the response
            return response.data?.data || [];
        } catch (error) {
            throw handleApiError(error);
        }
    },
    editVaccination: async (vaccinationId, vaccinationData) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.VACCINATION_ENDPOINTS.UPDATE(vaccinationId), vaccinationData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    startVaccination: async (vaccinationId) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.VACCINATION_ENDPOINTS.START(vaccinationId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    endVaccination: async (vaccinationId) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.VACCINATION_ENDPOINTS.END(vaccinationId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    remindVaccination: async (vaccinationId) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.VACCINATION_ENDPOINTS.REMIND(vaccinationId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
      getVaccinationStatistics: async (vaccinationId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.VACCINATION_ENDPOINTS.STATISTICS(vaccinationId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};


export default vaccinationService;
