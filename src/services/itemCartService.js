import apiClient from '../api/client';

const itemCartService = {
  getAll: async (page = 0, size = 15, sort = 'creationDate') => {
    const response = await apiClient.get('/api/student/item-cart', {
      params: { page, size, sort }
    });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get('/api/student/item-cart/id', {
      params: { id }
    });
    return response.data;
  },
  
  getByCartId: async (cartId, page = 0, size = 10, sort = 'creationDate') => {
    const response = await apiClient.get('/api/student/item-cart/cart', {
      params: { cartId, page, size, sort }
    });
    return response.data;
  },
  
  create: async (cartId, productId, quantity) => {
    const formData = new FormData();
    formData.append('sendData', JSON.stringify({ cartId, productId, quantity }));
    const response = await apiClient.post('/api/student/item-cart', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  addToCurrentCart: async (userId, productId, quantity) => {
    const response = await apiClient.post('/api/student/item-cart/add', null, {
      params: { userId, productId, quantity }
    });
    return response.data;
  },
  
  updateQuantity: async (id, quantity) => {
    const response = await apiClient.put('/api/student/item-cart/quantity', null, {
      params: { id, quantity }
    });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete('/api/student/item-cart', {
      params: { id }
    });
    return response.data;
  }
};

export default itemCartService;
