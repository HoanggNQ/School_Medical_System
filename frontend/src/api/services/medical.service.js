import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';
import { handleApiError } from '../../utils/api.helper';

export const medicalService = {
  // Create a new medication
  createMedication: async (newMedicineData) => {
    try {
      const formData = new FormData();
      const { image, ...medicationDataForBackend } = newMedicineData;
      formData.append('medication', JSON.stringify(medicationDataForBackend));
      if (image instanceof File) {
        formData.append('image', image);
      }
      const response = await axiosInstance.post(
        API_ENDPOINTS.MEDICATION_ENDPOINTS.CREATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateMedication: async (medicineId, updatedMedicineData) => {
    try {
      const formData = new FormData();
      const { image, ...medicationDataForBackend } = updatedMedicineData;
      formData.append('medication', JSON.stringify(medicationDataForBackend));
      if (image instanceof File) {
        formData.append('image', image);
      }
      const response = await axiosInstance.post(
        `api/v1/medications/${medicineId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  deleteMedication: async (medicineId) => {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.MEDICATION_ENDPOINTS.DELETE(medicineId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get all medications
  getAllMedications: async ({ page = 0, size = 10, sort = 'medicationName,ASC' } = {}) => {
    try {

      const params = { page, size, sort };
      const response = await axiosInstance.get(API_ENDPOINTS.MEDICATION_ENDPOINTS.GET_ALL, { params });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getAllMedicationRequest: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MEDICATION_REQUEST.GET_ALL);
      return response.data?.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },
  approveMedicationRequest: async (requestId) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.MEDICATION_REQUEST.APPROVE_REQUEST(requestId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  rejectMedicationRequest: async (requestId) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.MEDICATION_REQUEST.REQUEST_MEDICATION(requestId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAllApprovedMedicationRequest: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MEDICATION_REQUEST.GET_ALL_APPROVED);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Medical Event APIs
  createMedicalEvent: async (eventData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.EVENT.CREATE,eventData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateMedicalEvent: async (eventId, eventData) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.EVENT.UPDATE(eventId),eventData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAllMedicalEvents: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.EVENT.GET_ALL, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMedicalEventById: async (eventId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.EVENT.GET_BY_ID(eventId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteMedicalEvent: async (eventId) => {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.EVENT.DELETE(eventId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
   //Vaccine
   getAllVaccine: async ({ page = 0, size = 10 } = {}) => {
    try {
      const params = { page, size };
      const response = await axiosInstance.get(API_ENDPOINTS.Vaccine.GET_ALL,{params});
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getVaccinationConsentsByCampaign: async (campaignId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.Vaccine.GET_BY_CAM(campaignId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getHealthCheckConsentsByCampaign: async (campaignId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.HealthCheck.GET_BY_CAM(campaignId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
 
  createVaccine: async (vaccineData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.Vaccine.CREATE,vaccineData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
 
  createHealthCheckResult: async (healthCheckData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.HealthCheck.CREATE, healthCheckData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default medicalService;
