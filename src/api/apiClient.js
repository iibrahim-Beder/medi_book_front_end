import axios from 'axios';


const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://0e76c0c03210.ngrok-free.app/Api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    

    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response Success:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      // Unauthorized - توجيه لصفحة login
      console.log('Unauthorized, redirecting to login...');
    } else if (error.response?.status === 404) {
      console.log('Resource not found');
    } else if (error.code === 'NETWORK_ERROR') {
      console.log('Network error - check internet connection');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;