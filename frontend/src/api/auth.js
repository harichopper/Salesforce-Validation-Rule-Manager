import client from './client';

export const getAuthStatus = () => client.get('/api/auth/status');

export const logout = () => client.post('/api/auth/logout');

/** Redirect browser to Salesforce OAuth login */
export const loginWithSalesforce = () => {
  window.location.href = '/api/auth/salesforce';
};
