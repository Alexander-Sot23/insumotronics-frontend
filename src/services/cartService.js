import apiClient from '../api/client';

const cartService = {
  getAll: async (page = 0, size = 15, sort = 'creationDate') => {
    const response = await apiClient.get('/api/student/cart', {
      params: { page, size, sort }
    });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get('/api/student/cart/id', {
      params: { id }
    });
    return response.data;
  },
  
  getByUserId: async (userId, page = 0, size = 10, sort = 'creationDate') => {
    const response = await apiClient.get('/api/student/cart/user', {
      params: { userId, page, size, sort }
    });
    return response.data;
  },
  
  getOrCreateCurrentCart: async (userId) => {
    const response = await apiClient.get('/api/student/cart/current', {
      params: { userId }
    });
    return response.data;
  },
  
  create: async (userId) => {
    const formData = new FormData();
    formData.append('sendData', JSON.stringify({ myUserId: userId }));
    const response = await apiClient.post('/api/student/cart', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete('/api/student/cart', {
      params: { id }
    });
    return response.data;
  }
};

export default cartService;
