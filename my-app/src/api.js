// api.js
export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = options.headers ? { ...options.headers } : {};

  if (token) {
    headers['Authorization'] = `${token}`;
  } else {
    console.warn('Токен не найден в localStorage');
  }

  return fetch(url, { ...options, headers });
};