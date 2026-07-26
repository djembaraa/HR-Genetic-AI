export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Global fetch wrapper that automatically handles token refresh on 401
export const fetchApi = async (url, options = {}) => {
  let token = localStorage.getItem('token');
  
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  // Set credentials to 'include' if we need to send cookies (like refresh token)
  options.credentials = 'include';

  let response = await fetch(`${API_BASE}${url}`, options);

  // If 401 Unauthorized (likely token expired), try to refresh
  if (response.status === 401) {
    try {
      const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include' // Important to send the refresh cookie
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        // Save new token
        localStorage.setItem('token', refreshData.token);
        
        // Update headers for retry
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${refreshData.token}`
        };

        // Retry original request
        response = await fetch(`${API_BASE}${url}`, options);
      } else {
        // Refresh failed (cookie expired/invalid), force logout
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } catch (refreshErr) {
      console.error('Failed to refresh token:', refreshErr);
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }

  return response;
};
