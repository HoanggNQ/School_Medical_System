export const handleApiError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = error.response;

        switch (status) {
            case 400:
                return {
                    message: data.message || 'Bad Request',
                    errors: data.errors,
                };
            case 401:
                return {
                    message: 'Unauthorized access. Please login again.',
                };
            case 403:
                return {
                    message: 'You do not have permission to perform this action.',
                };
            case 404:
                return {
                    message: 'The requested resource was not found.',
                };
            case 500:
                return {
                    message: 'Internal server error. Please try again later.',
                };
            default:
                return {
                    message: 'An unexpected error occurred.',
                };
        }
    } else if (error.request) {
        // The request was made but no response was received
        return {
            message: 'No response from server. Please check your internet connection.',
        };
    } else {
        // Something happened in setting up the request that triggered an Error
        return {
            message: error.message || 'An unexpected error occurred.',
        };
    }
};

export const formatApiResponse = (response) => {
    return {
        data: response.data,
        status: response.status,
        headers: response.headers,
    };
}; 