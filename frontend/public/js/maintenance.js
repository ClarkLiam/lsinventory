import { render } from "./utils.js";

/**
 * Render maintenance tracking view.
 */
export const showMaintenance = () => {
  render(
    "#app",
    `<section><h2>Maintenance</h2><p>TODO: Implement service history and due reminder UI.</p></section>`,
  );
};
