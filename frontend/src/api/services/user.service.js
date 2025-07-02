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

    // Get users with pagination, sorting, and filtering
    getUsersPaginated: async (params = {}) => {
        try {
            const {
                page = 0,
                size = 10,
                sort = 'string',
                search = '',
                roleName = '',
                status = ''
            } = params;

            // Build query parameters
            const queryParams = new URLSearchParams();
            queryParams.append('page', page);
            queryParams.append('size', size);
            queryParams.append('sort', sort);

            // Add optional filters
            if (search) {
                queryParams.append('search', search);
            }
            if (roleName) {
                queryParams.append('roleName', roleName);
            }
            if (status) {
                queryParams.append('status', status);
            }

            const response = await axiosInstance.get(`api/v1/user?${queryParams.toString()}`);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get user profile
    getProfile: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.USER.PROFILE);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
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
    },

    changePassword: async (passwordData) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.USER.CHANGE_PASSWORD, passwordData);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    forgotPassword: async (email) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.USER.FORGOT_PASSWORD, { email });
            return response;
        } catch (error) {
            throw error;
        }
    },

    createNurse: async (nurseData) => {
        try {
            // Đảm bảo đúng key cho API backend
            const payload = {
                email: nurseData.email,
                password: nurseData.password,
                username: nurseData.username,
                address: nurseData.address,
                gender: nurseData.gender,
                avatarUrl: nurseData.avatarUrl || '',
                phoneNumber: nurseData.phoneNumber,
                fullname: nurseData.fullname || nurseData.fullName,
                dob: nurseData.dob
            };
            const response = await axiosInstance.post('api/v1/user/createNurse', payload);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default UserService;