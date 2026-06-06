import { apiRequest } from "./api.js";
import { render } from "./utils.js";

const AUTH_TOKEN_KEY = "lsinventory.authToken";
const AUTH_USER_KEY = "lsinventory.authUser";

export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

export const hasAuthToken = () => Boolean(getAuthToken());

export const getAuthUser = () => {
  const storedUser = window.localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (_error) {
    return null;
  }
};

export const setAuthSession = ({ token, user }) => {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
};

/**
 * Trigger login request.
 */
export const login = async (username, password) => {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (response?.token) {
    setAuthSession(response);
  }

  return response;
};

/**
 * Trigger logout request.
 */
export const logout = async () => {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } finally {
    clearAuthSession();
  }
};

/**
 * Render the login screen.
 */
export const renderLoginView = (options = {}) => {
  const { message = "Sign in to manage inventory.", onSuccess } = options;

  render(
    "#app",
    `
      <section class="auth-card">
        <div class="auth-copy">
          <p class="eyebrow">Authentication</p>
          <h2>Sign in</h2>
          <p>${message}</p>
        </div>
        <form id="login-form" class="auth-form">
          <label>
            Username
            <input name="username" type="text" autocomplete="username" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autocomplete="current-password" required />
          </label>
          <button type="submit">Sign in</button>
          <p id="auth-status" class="form-status" aria-live="polite"></p>
        </form>
      </section>
    `,
  );

  const form = document.querySelector("#login-form");
  const status = document.querySelector("#auth-status");
  // Try automatic builtin login first to avoid blocking the UI
  (async () => {
    if (status) {
      status.textContent = "Signing in...";
    }

    try {
      const response = await login("lsinventory", "ls");
      if (response?.token) {
        if (status) status.textContent = response?.message || "Signed in.";
        onSuccess?.(response);
        return; // done
      }
    } catch (err) {
      // ignore and fall through to show manual form
    }

    if (status) {
      status.textContent = "";
    }
  })();

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");

    if (status) {
      status.textContent = "Signing in...";
    }

    try {
      const response = await login(username, password);
      if (status) {
        status.textContent = response?.message || "Signed in.";
      }
      onSuccess?.(response);
    } catch (error) {
      if (status) {
        status.textContent = error instanceof Error ? error.message : "Login failed.";
      }
    }
  });
};
