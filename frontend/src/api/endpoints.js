const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'api/v1/auth/login',
    REGISTER: 'api/v1/auth/register',
    resendVerificationCode: 'api/v1/otp/resend',
    FORGOT_PASSWORD: 'api/v1/auth/forgot-password',
    RESET_PASSWORD: 'api/v1/auth/reset-password',
    LOGOUT: 'api/v1/auth/logout',
    VERIFY_EMAIL: 'api/v1/otp/verify',
  },
  USER: {
    FORGOT_PASSWORD: 'api/v1/user/forgot-password',
    PROFILE: 'api/v1/user/profile',
    UPDATE_PROFILE: 'api/v1/user/update',
    CHANGE_PASSWORD: 'api/v1/user/change-password',
    GET_ALL: 'api/v1/user/get-All-Users',
    CREATE: 'api/v1/user',
    GET_BY_ID: (id) => `api/v1/user/${id}`,
    UPDATE: (id) => `api/v1/user/${id}`,
    DELETE: (id) => `api/v1/user/delete/${id}`,
  },
  HEALTH: {
    RECORDS: '/health-records',
    RECORD_DETAIL: (id) => `/health-records/${id}`,
    CREATE_RECORD: '/health-records',
    UPDATE_RECORD: (id) => `/health-records/${id}`,
    DELETE_RECORD: (id) => `/health-records/${id}`,
  },
  MEDICATION_ENDPOINTS: {
    CREATE: 'api/v1/medications',
    GET_ALL: 'api/v1/medications',
    UPDATE: (id) => `api/v1/medications/${id}`,
    DELETE: (id) => `api/v1/medications/${id}`,
  },
  MEDICATION_REQUEST: {
    GET_ALL: 'api/v1/medication-requests/pending',
    REQUEST_MEDICATION: (id) => `api/v1/medication-requests/${id}/reject`,
    APPROVE_REQUEST: (id) => `api/v1/medication-requests/${id}/approve`,
    GET_ALL_APPROVED: 'api/v1/medication-requests/approve',
    GET_ALL_REJECTED: 'api/v1/medication-requests/reject',
  },
  EVENT: {
    CREATE: 'api/v1/medical-event/create',
    GET_ALL: 'api/v1/medical-event/getAll/all',
    GET_BY_ID: (id) => `api/v1/medical-event/${id}`,
    UPDATE: (id) => `api/v1/medical-event/update/${id}`,
    DELETE: (id) => `api/v1/medical-event/delete/${id}`,
  },
  Vaccine: {
    GET_ALL: 'api/vaccination-consent/getAll',
    GET_BY_CAM: (id) => `api/vaccination-consent/campaigns/${id}/consents`,
    CREATE: 'api/vaccination-record/records',
     GET_RESULT_BY_CAM: (id) => `api/vaccination-record/campaigns/${id}/records`
  },
  HealthCheck: {
    GET_BY_CAM: (id) => `api/v1/health-check-consent/campaigns/${id}/consentsAll/`,
    CREATE: 'api/v1/health-check-result/results',
    STATISTICS: (id) => `api/v1/dashboard/healthCheck/${id}/statistics`,
    GET_ALL_CONSENT: 'api/v1/health-check-consent/getAll',
    GET_RESULT_BY_CAM: (id) => `api/v1/health-check-result/campaigns/${id}/results`
  },
  Health_Declaration:{
    UPDATE_STATUS: (id)=> `api/v1/health-declarations/${id}/status `,
    GET_ALL_DECLARATIONS: `api/v1/health-declarations/search`,

  },
  Student: {
   
    GET_ALL_Student: 'api/v1/student/getAll',
  

  },
  PARENT: {
    GET_PARENT_PROFILE: '/api/v1/user/profile',
    GET_STUDENT_HEALTH_CHECK: (studentId) => `/api/v1/health-check-result/students/${studentId}/results`,
    GET_ALL_MEDICINE: `api/v1/medications`,
    POST_MEDICINE_REQUEST: '/api/v1/medication-requests',
    GET_STUDENT_VACCINATION: (studentId) => `/api/v1/vaccination/students/${studentId}/vaccinations`,
    POST_HEALTH_DECLARATION: `/api/v1/health-declarations`,
    DELETE_HEALTH_DECLARATION: (id) => `/api/v1/health-declarations/${id}`,
    GET_HEALTH_DECLARATION: (studentId) => `/api/v1/health-declarations/student/${studentId}/details`,
    UPDATE_HEALTH_DECLARATION: (id) => `/api/v1/health-declarations/${id}`,
    GET_NOTIFICATION: `/api/v1/notification`,
    NOTIFICATION_READ: (id) => `/api/v1/notification/${id}/read`,
    DELETE_NOTIFICATION: (id) => `/api/v1/notification/delete/${id}`,
    GET_SCHEDULE: (parentId) => `/api/v1/consultation-schedules/parent/${parentId}`,
    GET_STUDENT_EVENT: (studentId) => `/api/v1/student/students/${studentId}/events`,
    UPDATE_ACCEPTED_VACCINATION: (id) => `/api/vaccination-consent/consents/${id}`,
    UPDATE_ACCEPTED_HEALTH_CHECK: (id) => `/api/v1/health-check-consent/consents/${id}`,
    GET_STUDENT_MEDICAL_EVENT: (studentId) => `/api/v1/medical-event/student/${studentId}`,
    GET_STUDENT_HEALTH_PROFILE: (studentId) => `/api/v1/health-declarations/students/${studentId}/profile`,
    GET_MEDICINE_REQUEST: (studentId) => `/api/v1/medication-requests/by-student/${studentId}`,
    DELETE_MEDICINE_REQUEST: (id) => `/api/v1/medication-requests/${id}/cancel`,
    UPDATE_MEDICINE_REQUEST: (id) => `/api/v1/medication-requests/${id}`,
  },

  STUDENT: {
    GET_STUDENT_BY_PARENT_ID : (parentId) => `api/v1/student/findStudentByParent/${parentId}`,
    GET_STUDENT_PROFILE: (studentId)=> `/api/v1/student/getById/${studentId}`,
    GET_STUDENT_VACCINATION_RECORD: (studentId) => `/api/vaccination-record/students/${studentId}/records`,
    GET_STUDENT_HEALTH_CHECK_RECORD: (studentId) => `/api/v1/health-declarations/students/${studentId}/profile`,
    GET_STUDENT_SCHEDULE: (studentId) => `/api/v1/student/student/${studentId}/approved-events`,
    GET_PARENT_PROFILE: (parentId) => `/api/v1/user/${parentId}`,
    
    CREATE: `api/v1/student`,
  },
  CAMPAIGN_ENDPOINTS: {
    CREATE: 'api/v1/health-check-campaign/campaigns',
    GET_ALL: 'api/v1/health-check-campaign/campaigns',
    UPDATE: (id) => `api/v1/health-check-campaign/campaigns/${id}`,
    DELETE: (id) => `api/v1/health-check-campaign/delete/${id}`,
    GET_BY_ID: (id) => `api/v1/health-check-campaign/campaigns/${id}`,
    START: (id) => `api/v1/health-check-campaign/campaigns/${id}/start`,
    END: (id) => `api/v1/health-check-campaign/campaigns/${id}/end`,
    REMIND: (id)=> `api/v1/health-check-campaign/campaigns/${id}/remind`,
  },
  VACCINATION_ENDPOINTS: {
    CREATE:   `api/vaccination-campaign/campaigns`,
    GET_ALL: 'api/vaccination-campaign/campaigns',
    UPDATE: (id) => `api/vaccination-campaign/campaigns/${id}`,
    DELETE: (id) => `api/vaccination-campaign/campaigns/${id}`,
    GET_BY_ID: (id) => `api/vaccination-campaign/campaigns/${id}`,
    START: (id) => `api/vaccination-campaign/campaigns/${id}/start`,
    END: (id) => `api/vaccination-campaign/campaigns/${id}/end`,
    REMIND: (id)=> `api/vaccination-campaign/campaigns/${id}/remind`,
    STATISTICS: (id) => `api/v1/dashboard/vaccination/${id}/statistics`,


  },
  BLOG: {
    GET_ALL: 'api/contents/getAll',
    CREATE: 'api/contents/create',
    GET_BY_ID: (id) => `api/contents/getById/${id}`,
    UPDATE: (id) => `api/contents/update/${id}`,
    DELETE: (id) => `api/contents/delete/${id}`,
    GET_ALL_CATEGORIES: 'api/v1/content-category',
    GET_BY_CATEGORY: (categoryId) => `api/contents/findContentByCategory/${categoryId}`,
  },
  DASHBOARD: {
    OVERVIEW: 'api/v1/dashboard/overview',
  },
};

export default API_ENDPOINTS;