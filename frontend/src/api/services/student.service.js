import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const studentService = {
    searchStudentsPaged: async (searchKeyword) => {
        const res = await axiosInstance.get("/api/v1/student/getAll", {
          params: {
            search: searchKeyword,
            page: 0,
            size: 10,
          }
        });
        return res.data?.data?.students || [];
      },
    getStudentProfile: async (studentId) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.STUDENT.GET_STUDENT_PROFILE(studentId));
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
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    getStudentSchedule: async (studentId) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.STUDENT.GET_STUDENT_SCHEDULE(studentId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getParentProfile: async (parentId) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.STUDENT.GET_PARENT_PROFILE(parentId));
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    
    searchParent: async (name) => {
        try {
            const response = await axiosInstance.get(`/api/v1/user/searchParent`, { params: { name } });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
}

export default studentService;