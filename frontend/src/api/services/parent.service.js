// import { get } from 'http';
import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';



const ParentService = {
    getStudent: async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axiosInstance.get(API_ENDPOINTS.STUDENT.GET_STUDENT_BY_PARENT_ID(user.id));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getParentProfile: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.PARENT.GET_PARENT_PROFILE);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getStudentHealthCheck: async (studentID) =>{
        try{
            const response = await axiosInstance.get(API_ENDPOINTS.PARENT.GET_STUDENT_HEALTH_CHECK(studentID));
            return response.data;
        } catch(error){
            throw handleApiError(error);
        }
    },

    getAllMedicine: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.PARENT.GET_ALL_MEDICINE);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
}

export default ParentService;