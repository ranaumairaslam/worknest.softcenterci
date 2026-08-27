  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
  const TOKEN_KEY = 'worknest_token';

  function getAuthToken() {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  }

  export function setAuthToken(token) {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  function toQueryString(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }

  export async function request(path, options = {}) {
    const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(result?.message || response.statusText || 'API request failed');
      error.status = response.status;
      error.data = result;
      throw error;
    }

    return result;
  }

  export async function get(path, params) {
    const queryString = toQueryString(params);
    return request(`${path}${queryString}`, { method: 'GET' });
  }

  export async function post(path, body) {
    return request(path, { method: 'POST', body: JSON.stringify(body) });
  }

  export async function put(path, body) {
    return request(path, { method: 'PUT', body: JSON.stringify(body) });
  }

  export async function patch(path, body) {
    return request(path, { method: 'PATCH', body: JSON.stringify(body) });
  }

  export async function del(path) {
    return request(path, { method: 'DELETE' });
  }
