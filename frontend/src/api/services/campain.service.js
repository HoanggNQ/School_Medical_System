import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';
import { handleApiError } from '../../utils/api.helper';


export const campaignService = {
    // Create a new medication
    createCampaign: async (campaignData) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.CAMPAIGN_ENDPOINTS.CREATE, campaignData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    getCampaignById: async (campaignId) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.CAMPAIGN_ENDPOINTS.GET_BY_ID(campaignId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    // Get all medications
    getAllCampaigns: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.CAMPAIGN_ENDPOINTS.GET_ALL);
            // Return the data array from the response
            return response.data?.data || [];
        } catch (error) {
            throw handleApiError(error);
        }
    },
    editCampaign: async (campaignId, campaignData) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.CAMPAIGN_ENDPOINTS.UPDATE(campaignId), campaignData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    startCampaign: async (campaignId) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.CAMPAIGN_ENDPOINTS.START(campaignId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    endCampaign: async (campaignId) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.CAMPAIGN_ENDPOINTS.END(campaignId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    deleteCampaign: async (campaignId) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.CAMPAIGN_ENDPOINTS.DELETE(campaignId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default campaignService;
