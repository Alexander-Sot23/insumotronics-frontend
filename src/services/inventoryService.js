import apiClient from '../api/client';

const inventoryService = {
  getAllProducts: async (role, page = 0, size = 15, sort = 'createdDate') => {
    const isAdmin = role?.toUpperCase() === 'ADMIN';
    const basePath = isAdmin ? '/api/admin/product' : '/api/student/product';
    
    const response = await apiClient.get(basePath, {
      params: { page, size, sort }
    });
    return response.data;
  },

  getProductById: async (role, id) => {
    const isAdmin = role?.toUpperCase() === 'ADMIN';
    const basePath = isAdmin ? '/api/admin/product/id' : '/api/student/product/id';
    
    const response = await apiClient.get(basePath, {
      params: { id }
    });
    return response.data;
  },

  searchByName: async (role, name, page = 0, size = 15) => {
    const isAdmin = role?.toUpperCase() === 'ADMIN';
    const basePath = isAdmin ? '/api/admin/product/name' : '/api/student/product/name';
    
    const response = await apiClient.get(basePath, {
      params: { name, page, size }
    });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await apiClient.get('/api/admin/product/stats');
    return response.data;
  },

  getRecentReserves: async (page = 0, size = 5) => {
    const response = await apiClient.get('/api/admin/reserve', {
      params: { page, size, sort: 'creationDate' }
    });
    return response.data;
  },

  getUserHistory: async (userId, page = 0, size = 5) => {
    const response = await apiClient.get('/api/student/reserve', {
      params: { userId, page, size, sort: 'creationDate' }
    });
    return response.data;
  },

  getStudentStats: async (userId) => {
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

  createProduct: async (productData, images, documents) => {
    const formData = new FormData();
    formData.append('sendData', JSON.stringify(productData));
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }
    
    if (documents) {
      for (let i = 0; i < documents.length; i++) {
        formData.append('documents', documents[i]);
      }
    }

    const response = await apiClient.post('/api/admin/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, productData, images, documents) => {
    const formData = new FormData();
    formData.append('sendData', JSON.stringify(productData));
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }
    
    if (documents) {
      for (let i = 0; i < documents.length; i++) {
        formData.append('documents', documents[i]);
      }
    }

    const response = await apiClient.put(`/api/admin/product`, formData, {
      params: { id },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete('/api/admin/product', {
      params: { id }
    });
    return response.data;
  }
};

export default inventoryService;
