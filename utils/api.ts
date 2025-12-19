// API client with environment-aware base URL
const getApiUrl = () => {
  // In development, the proxy handles /api routes
  // In production, use the environment variable (already includes /api in the proxy)
  if (import.meta.env.DEV) {
    return '/api';
  }
  return import.meta.env.VITE_API_URL || 'https://amromeet-backend.vercel.app';
};

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authorization token if available
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  return response;
};

export const apiGet = (endpoint: string) =>
  apiCall(endpoint, { method: 'GET' });

export const apiPost = (endpoint: string, body?: any) =>
  apiCall(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });

export const apiPut = (endpoint: string, body?: any) =>
  apiCall(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });

export const apiDelete = (endpoint: string) =>
  apiCall(endpoint, { method: 'DELETE' });
