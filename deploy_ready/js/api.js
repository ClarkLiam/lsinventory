/* API wrapper pointed to inventory.lstudios-media.de */
const AUTH_TOKEN_KEY = "lsinventory.authToken";
const BASE = 'https://inventory.lstudios-media.de/api';

const getStoredAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

const requestJson = async (path, options = {}) => {
  const storedToken = getStoredAuthToken();

  return fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
};

export const apiRequest = async (path, options = {}) => {
  try {
    const response = await requestJson(path, options);
    if (response.ok) return response.json();
    throw new Error(`API request failed: ${response.status}`);
  } catch (err) {
    throw err instanceof Error ? err : new Error('API request failed');
  }
};
