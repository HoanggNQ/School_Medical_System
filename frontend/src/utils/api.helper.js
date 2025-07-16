
export const handleApiError = (error) => {
    if (error.response) {
        const { status, data } = error.response;

       
        const message = data?.message || getDefaultMessageByStatus(status);
        //tại sao chỗ này là có thể in được mà bên axios không làm được nhỉ?
        

      
        const customError = new Error(message);
        customError.name = 'ApiError';
        customError.status = status;
        customError.response = error.response;
        customError.data = data;
        customError.code = data?.code || null;

        return customError;
    }

    if (error.request) {
        
        return new Error('Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.');
    }

    
    return new Error(error.message || 'Đã xảy ra lỗi không xác định.');
};


const getDefaultMessageByStatus = (status) => {
    switch (status) {
        case 400:
            return 'Yêu cầu không hợp lệ.';
        case 401:
            return 'Chưa xác thực. Vui lòng đăng nhập lại.';
        case 403:
            return 'Bạn không có quyền truy cập tài nguyên này.';
        case 404:
            return 'Không tìm thấy tài nguyên.';
        case 500:
            return 'Lỗi hệ thống. Vui lòng thử lại sau.';
        default:
            return 'Đã xảy ra lỗi không xác định.';
    }
};


export const formatApiResponse = (response) => {
    return {
        data: response.data,
        status: response.status,
        headers: response.headers,
    };
};
