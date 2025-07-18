import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';
import { handleApiError } from '../../utils/api.helper';

const fileService = {
    exportVaccinationRecord: async (campaignId) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.FILE_SERVICE.EXPORT_VACCINATION_RECORD(campaignId), {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    importVaccinationRecord: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post(API_ENDPOINTS.FILE_SERVICE.IMPORT_VACCINATION_RECORD, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    exportHealthCheckResult: async (campaignId) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.FILE_SERVICE.EXPORT_HEALTH_CHECK_RESULT(campaignId), {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    importHealthCheckResult: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post(API_ENDPOINTS.FILE_SERVICE.IMPORT_HEALTH_CHECK_RESULT, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default fileService; 