/**
 * Render HTML into an element by selector.
 */
export const render = (selector, html) => {
  const target = document.querySelector(selector);
  if (target) {
    target.innerHTML = html;
  }
};

/**
 * Escape text before inserting it into an HTML template string.
 */
export const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
