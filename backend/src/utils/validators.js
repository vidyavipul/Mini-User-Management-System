const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => emailRegex.test(email ?? '');

export const isStrongPassword = (password) => typeof password === 'string' && password.length >= 8;

export const isValidName = (name) => typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 100;
