import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const UserService = {
    // Create a new user
    createUser: async (userData) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.USER.CREATE, userData);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get all users
    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_ALL);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get user by ID
    getUserById: async (userId) => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.USER.GET_BY_ID}/${userId}`);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update user
    updateUser: async (userId, userData) => {
        try {
            const response = await axiosInstance.put(`${API_ENDPOINTS.USER.UPDATE}/${userId}`, userData);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete user
    deleteUser: async ({userId}) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.USER.DELETE(userId));
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default UserService;
