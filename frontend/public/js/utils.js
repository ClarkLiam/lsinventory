/**
 * Render HTML into an element by selector.
 */
export const render = (selector, html) => {
  const target = document.querySelector(selector);
  if (target) {
    target.innerHTML = html;
  }
};
