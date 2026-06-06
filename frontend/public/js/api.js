const AUTH_TOKEN_KEY = "lsinventory.authToken";

const getApiBaseCandidates = () => {
  // Force API base to production PHP host
  const fixed = 'https://inventory.lstudios-media.de/api';
  return [fixed];
};

const getStoredAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

const shouldRetryAgainstNextBase = (status) => [404, 405, 501].includes(status);

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

      if (!shouldRetryAgainstNextBase(response.status) || index === candidates.length - 1) {
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
