import axios from 'axios';

const baseURL = 'https://school-medical-system.onrender.com';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho request: tự động gắn token nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho response: xử lý lỗi và chuyển hướng nếu cần
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu lỗi 401 (hết hạn token hoặc chưa đăng nhập)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Chỉ chuyển hướng nếu không phải đang ở trang login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Nếu backend trả về message tùy chỉnh, gán vào error để UI hiển thị
    const customMessage = error.response?.data?.message;
    if (customMessage) {
      error.message = customMessage;
      error.customMessage = customMessage;
    }

    // Có thể xử lý thêm các lỗi mạng ở đây nếu muốn
    // if (!error.response) {
    //   error.message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!';
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;