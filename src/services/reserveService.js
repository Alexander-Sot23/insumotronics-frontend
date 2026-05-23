import apiClient from '../api/client';

const reserveService = {
  // Admin methods
  getAll: async (page = 0, size = 15, sort = 'creationDate', sinceHours) => {
    const response = await apiClient.get('/api/admin/reserve', {
      params: { page, size, sort, sinceHours }
    });
    return response.data;
  },
  
  getByStatusAdmin: async (status, page = 0, size = 10, sort = 'creationDate') => {
    const response = await apiClient.get('/api/admin/reserve/status', {
      params: { status, page, size, sort }
    });
    return response.data;
  },
  
  getByIdAdmin: async (id) => {
    const response = await apiClient.get('/api/admin/reserve/id', {
      params: { id }
    });
    return response.data;
  },
  
  confirmReserve: async (reserveId) => {
    const response = await apiClient.put('/api/admin/reserve/confirm', null, {
      params: { reserveId }
    });
    return response.data;
  },
  
  cancelReserve: async (reserveId, message) => {
    const formData = new FormData();
    formData.append('sendData', JSON.stringify({ message }));
    const response = await apiClient.put('/api/admin/reserve/cancel', formData, {
      params: { reserveId },
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Student methods
  getUserHistory: async (userId, page = 0, size = 15, sort = 'creationDate') => {
    const response = await apiClient.get('/api/student/reserve', {
      params: { userId, page, size, sort }
    });
    return response.data;
  },
  
  getDashboardStats: async (userId) => {
    const response = await apiClient.get('/api/student/reserve/dashboard-stats', {
      params: { userId }
    });
    return response.data;
  },
  
  getActiveReserves: async (userId) => {
    const response = await apiClient.get('/api/student/reserve/active', {
      params: { userId }
    });
    return response.data;
  },
  
  getByIdStudent: async (id) => {
    const response = await apiClient.get('/api/student/reserve/id', {
      params: { id }
    });
    return response.data;
  },
  
  getByUserIdAndStatus: async (userId, status, page = 0, size = 10, sort = 'creationDate') => {
    const response = await apiClient.get('/api/student/reserve/status', {
      params: { userId, status, page, size, sort }
    });
    return response.data;
  },
  
  checkoutCart: async (cartId) => {
    const response = await apiClient.post('/api/student/reserve/checkout', null, {
      params: { cartId }
    });
    return response.data;
  }
};

export default reserveService;
