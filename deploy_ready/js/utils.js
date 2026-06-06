export const render = (selector, html) => { const el = document.querySelector(selector); if (el) el.innerHTML = html; };
export const escapeHtml = (str) => String(str || '').replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[c]));
