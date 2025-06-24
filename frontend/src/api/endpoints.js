const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'api/v1/auth/login',
    REGISTER: 'api/v1/auth/register',
    FORGOT_PASSWORD: 'api/v1/auth/forgot-password',
    // FORGOT_PASSWORD: 'api/v1/user/forgot-password',

    RESET_PASSWORD: 'api/v1/auth/reset-password',
    LOGOUT: 'api/v1/auth/logout',
    VERIFY_EMAIL: 'api/v1/otp/verify',
  },

  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    GET_ALL: 'api/v1/user',
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
    GET_ALL: 'api/v1/medications/all',
    UPDATE: (id) => `api/v1/medications/${id}`,
    DELETE: (id) => `api/v1/medications/${id}`,
  },

  CAMPAIGN_ENDPOINTS: {
    CREATE: 'api/v1/health-check-campaign/campaigns',
    GET_ALL: 'api/v1/health-check-campaign/campaigns',
    UPDATE: (id) => `api/v1/health-check-campaign/campaigns/${id}`,
    DELETE: (id) => `api/v1/health-check-campaign/campaigns/${id}`,
    GET_BY_ID: (id) => `api/v1/health-check-campaign/campaigns/${id}`,
    START: (id) => `api/v1/health-check-campaign/campaigns/${id}/start`,
  },
  VACCINATION_ENDPOINTS: {
    CREATE: (createdById) => `api/vaccination-campaign/campaigns?createdById=${createdById}`,
    GET_ALL: 'api/vaccination-campaign/campaigns',
    UPDATE: (id) => `api/vaccination-campaign/campaigns/${id}`,
    DELETE: (id) => `api/vaccination-campaign/campaigns/${id}`,
    GET_BY_ID: (id) => `api/vaccination-campaign/campaigns/${id}`,
    START: (id) => `api/vaccination-campaign/campaigns/${id}/start`,
  },
};

export default API_ENDPOINTS; 