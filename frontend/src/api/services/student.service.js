import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const studentService = {
    getStudentProfile: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.STUDENT.GET_STUDENT_PROFILE);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    getStudentVaccinationRecord: async (studentId) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.STUDENT.GET_STUDENT_VACCINATION_RECORD(studentId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    getStudentHealthCheckRecord: async (studentId) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.STUDENT.GET_STUDENT_HEALTH_CHECK_RECORD(studentId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
}

export default studentService;