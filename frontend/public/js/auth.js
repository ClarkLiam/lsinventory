import { apiRequest } from "./api.js";

/**
 * Trigger login request.
 */
export const login = async (username, password) => {
  // TODO: Replace with secure credential handling and token persistence.
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};

/**
 * Trigger logout request.
 */
export const logout = async () => apiRequest("/auth/logout", { method: "POST" });
