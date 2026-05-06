import client from './client';

export const getAuthStatus = () => client.get('/auth/status');

export const logout = () => client.post('/auth/logout');

/** Redirect browser to Salesforce OAuth login */
export const loginWithSalesforce = () => {
  window.location.href = '/auth/salesforce';
};
