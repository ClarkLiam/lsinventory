const AUTH_TOKEN_KEY = "lsinventory.authToken";

const getApiBaseCandidates = () => {
  const candidates = [];
  const configuredBaseUrl = window.__LSI_API_BASE_URL__;

  if (configuredBaseUrl) {
    candidates.push(configuredBaseUrl);
  }

  candidates.push("/api");
  candidates.push(`${window.location.protocol}//${window.location.hostname}:3000/api`);

  return [...new Set(candidates)];
};

const getStoredAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

const requestJson = async (baseUrl, path, options = {}) => {
  const storedToken = getStoredAuthToken();

  return fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
};

/**
 * Basic fetch wrapper for JSON APIs.
 */
export const apiRequest = async (path, options = {}) => {
  const candidates = getApiBaseCandidates();
  let lastError = null;

  for (let index = 0; index < candidates.length; index += 1) {
    const baseUrl = candidates[index];

    try {
      const response = await requestJson(baseUrl, path, options);

      if (response.ok) {
        return response.json();
      }

      if (response.status !== 404 || index === candidates.length - 1) {
        throw new Error(`API request failed: ${response.status}`);
      }
    } catch (error) {
      lastError = error;
      if (index === candidates.length - 1) {
        throw error instanceof Error ? error : new Error("API request failed");
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("API request failed");
};
