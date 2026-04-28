import apiClient from '../api/client';

const userService = {
  getUserByCode: async (role, code) => {
    const isAdmin = role?.toUpperCase() === 'ADMIN';
    const basePath = isAdmin ? '/api/admin/user/code' : '/api/student/user/code';
    
    const response = await apiClient.get(basePath, {
      params: { code }
    });
    return response.data;
  },

  getUserById: async (id) => {
    // Only admin usually has this
    const response = await apiClient.get('/api/admin/user/id', {
      params: { id }
    });
    return response.data;
  },

  getAllUsers: async (page = 0, size = 15) => {
    const response = await apiClient.get('/api/admin/user', {
      params: { page, size }
    });
    return response.data;
  }
};

export default userService;
