import { apiRequest } from './api.js';

const AUTH_TOKEN_KEY = 'lsinventory.authToken';
const AUTH_USER_KEY = 'lsinventory.authUser';

export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);
export const hasAuthToken = () => Boolean(getAuthToken());
export const getAuthUser = () => {
  const storedUser = window.localStorage.getItem(AUTH_USER_KEY);
  if (!storedUser) return null;
  try { return JSON.parse(storedUser); } catch (_){ return null; }
};
export const setAuthSession = ({ token, user }) => {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};
export const clearAuthSession = () => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
};

export const login = async (username, password) => {
  const response = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
  if (response?.token) setAuthSession(response);
  return response;
};

export const logout = async () => {
  try { await apiRequest('/auth/logout', { method: 'POST' }); } finally { clearAuthSession(); }
};

export const renderLoginView = (options = {}) => {
  const { message = 'Sign in to manage inventory.', onSuccess } = options;
  document.querySelector('#app').innerHTML = `<section class="auth-card"><div class="auth-copy"><p class="eyebrow">Authentication</p><h2>Sign in</h2><p>${message}</p></div><form id="login-form" class="auth-form"><label>Username<input name="username" type="text" autocomplete="username" required /></label><label>Password<input name="password" type="password" autocomplete="current-password" required /></label><button type="submit">Sign in</button><p id="auth-status" class="form-status" aria-live="polite"></p></form></section>`;

  const form = document.querySelector('#login-form');
  const status = document.querySelector('#auth-status');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '');
    if (status) status.textContent = 'Signing in...';
    try {
      const response = await login(username, password);
      if (status) status.textContent = response?.message || 'Signed in.';
      onSuccess?.(response);
    } catch (error) {
      if (status) status.textContent = error instanceof Error ? error.message : 'Login failed.';
    }
  });
};
