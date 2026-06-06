const API_BASE_URL = window.__LSI_API_BASE_URL__ || "/api";
const AUTH_TOKEN_KEY = "lsinventory.authToken";

const getStoredAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

/**
 * Basic fetch wrapper for JSON APIs.
 */
export const apiRequest = async (path, options = {}) => {
  const storedToken = getStoredAuthToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};
