import axios from 'axios';

const BASE_URL = 'http://localhost:8081';

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosConfig.interceptors.request.use(
    (config) => {
      const authToken = JSON.parse(localStorage.getItem('token'))?.token;
      console.log(`Adding Authorization header with token: ${authToken}`); // Debugging log
      if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
  }
);

axiosConfig.interceptors.response.use(
    (response) => response,

    async (error) => {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized access - possibly invalid token');
        // Optionally, you can redirect to login or handle the error as needed
      }
      return Promise.reject(error);
    }
);

export default axiosConfig;