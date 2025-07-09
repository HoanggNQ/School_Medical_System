import { handleApiError } from '../../utils/api.helper';
import axiosInstance from '../axios.config';
import API_ENDPOINTS from '../endpoints';

const BlogService = {
    // Get all blogs with pagination, sorting, and filtering
    getAllBlogs: async ({ page, sort, search = '' } = {}) => {
        try {
            const params = { page, size: 10 };
            if (sort) {
                params.sort = sort;
            }
            if (search) {
                params.search = search;
            }
            const response = await axiosInstance.get(API_ENDPOINTS.BLOG.GET_ALL, { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Create a new blog
    createBlog: async (blogData) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.BLOG.CREATE, blogData);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get blog by ID
    getBlogById: async (blogId) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.BLOG.GET_BY_ID(blogId));
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Update blog
    updateBlog: async (blogId, blogData) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.BLOG.UPDATE(blogId), blogData);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Delete blog
    deleteBlog: async (blogId) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.BLOG.DELETE(blogId));
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get all categories
    getAllCategories: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.BLOG.GET_ALL_CATEGORIES);
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get blogs by category
    getBlogsByCategory: async (categoryId) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.BLOG.GET_BY_CATEGORY(categoryId));
            return response;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default BlogService; 