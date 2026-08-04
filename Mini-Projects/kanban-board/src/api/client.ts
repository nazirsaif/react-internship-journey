import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = 'http://localhost:3001';

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const { accessToken } = useAuthStore.getState();
  
  const headers = new Headers(options.headers || {});
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Important for sending httpOnly cookies
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }
    const error = new Error(errorData.error || `Request failed with status ${response.status}`);
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}
