import { apiRequest } from './client';

export const fetchMe = async ({ token }) => apiRequest('/api/users/me', { token });

export const updateProfile = async ({ fullName, email, token }) =>
  apiRequest('/api/users/me', { method: 'PATCH', body: { fullName, email }, token });

export const changePassword = async ({ currentPassword, newPassword, token }) =>
  apiRequest('/api/users/me/password', {
    method: 'PATCH',
    body: { currentPassword, newPassword },
    token,
  });
