import axios from 'axios';


const baseURL = 'https://school-medical-system.onrender.com';


const axiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {



        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/auth';
        }


        const customMessage = error.response?.data?.message;
        console.log('==> customMessage', customMessage);

        if (customMessage) {
            error.message = customMessage;
            error.customMessage = customMessage; // Thêm property riêng
        }


        return Promise.reject(error); // Trả lỗi xuống cho `catch()` sử dụng
    }
);



export default axiosInstance;
