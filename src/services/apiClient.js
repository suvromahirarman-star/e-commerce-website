/**
 * AURA Studio Unified API Client
 * Automatically manages credentials, HttpOnly cookie authorization,
 * error normalization, and fallback resiliency.
 */

const API_BASE = (import.meta.env?.VITE_API_URL || '/api/v1').replace(/\/+$/, '');

class ApiClient {
  async request(endpoint, options = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${cleanEndpoint}`;

    const headers = {
      ...options.headers,
    };

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers,
      credentials: 'include', // Guarantees HttpOnly cookies are passed across requests
    };

    try {
      const response = await fetch(url, config);

      let payload = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        payload = await response.json();
      }

      if (!response.ok) {
        const errorMsg =
          payload?.message ||
          (payload?.errors && Array.isArray(payload.errors) ? payload.errors.map((e) => e.message).join(', ') : null) ||
          `HTTP Error ${response.status}: ${response.statusText}`;

        const err = new Error(errorMsg);
        err.status = response.status;
        err.payload = payload;
        throw err;
      }

      // Return unwrapped payload data if standard ApiResponse, or payload itself
      return payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload;
    } catch (err) {
      throw err;
    }
  }

  get(endpoint, params = {}, options = {}) {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { ...options, method: 'GET' });
  }

  post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
