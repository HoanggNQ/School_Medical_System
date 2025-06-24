import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const AuthService = {
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
            if (response.data.data.accessToken) {
                localStorage.setItem('token', response.data.data.accessToken);
                if (response.data.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.data.user));
                }
            }
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    },

    register: async (userData) => {
        try {
            const formData = new FormData();
            
            // Append user data as a single field named 'user'
            formData.append('user', JSON.stringify(userData));

            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    verifyEmail: async ({email, otp}) => {
        try {
            const response = await axiosInstance.patch(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { email, otp });
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },


    forgotPassword: async (email) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            return response;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
                token,
                newPassword,
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            throw error;
        }
    },
};

export default AuthService; 