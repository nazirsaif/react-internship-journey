import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = 'http://localhost:3001';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

export async function apiClient(endpoint: string, options: RequestInit = {}): Promise<any> {
  const { accessToken, setAccessToken, logout } = useAuthStore.getState();
  
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
    credentials: 'include',
  };

  let response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!refreshRes.ok) {
          throw new Error('Refresh failed');
        }

        const data = await refreshRes.json();
        setAccessToken(data.accessToken);
        isRefreshing = false;
        onRefreshed(data.accessToken);
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];
        logout();
        throw err;
      }
    }

    const retryPromise = new Promise((resolve) => {
      addRefreshSubscriber((token: string) => {
        const newHeaders = new Headers(options.headers || {});
        newHeaders.set('Authorization', `Bearer ${token}`);
        if (!newHeaders.has('Content-Type')) newHeaders.set('Content-Type', 'application/json');
        
        resolve(fetch(`${BASE_URL}${endpoint}`, {
          ...options,
          headers: newHeaders,
          credentials: 'include',
        }));
      });
    });

    response = (await retryPromise) as Response;
  }

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
