import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8080`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para peticiones: añade el token JWT si existe
apiClient.interceptors.request.use(
  (config) => {
    // El token se envía automáticamente en la cookie HttpOnly
    
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas: manejar errores de autenticación (401, 403)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/api/login');

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Solo limpiar y redirigir si NO es una petición de login
      if (!isLoginRequest) {
        console.warn('Sesión expirada o acceso denegado. Redirigiendo...');
        localStorage.removeItem('user');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);


export default apiClient;
