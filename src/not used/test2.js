import axios from 'axios';

// إنشاء instance من axios مع إعدادات CORS
const apiClient = axios.create({
  baseURL: 'https://ebf32fecda0c.ngrok-free.app/Api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true' // هذه مهمة لـ ngrok
  }
});

// إضافة interceptor للتعامل مع الأخطاء
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const patientService = {
  getPatientBasicInfo: async (patientId) => {
    try {
      const response = await apiClient.get(`/PatientBasicInfo/GetPatientBasicInfo?PatientId=${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient data:', error);
      throw error;
    }
  }
};