import { apiRequest } from './client';

export const fetchUsers = async ({ page = 1, limit = 10, token }) => {
  return apiRequest(`/api/users?page=${page}&limit=${limit}`, { token });
};

export const activateUser = async ({ userId, token }) => {
  return apiRequest(`/api/users/${userId}/activate`, { method: 'PATCH', token });
};

export const deactivateUser = async ({ userId, token }) => {
  return apiRequest(`/api/users/${userId}/deactivate`, { method: 'PATCH', token });
};
