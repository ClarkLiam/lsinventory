import { hasAuthToken, renderLoginView } from "./auth.js";
import { showInventory } from "./inventory.js";
import { showMaintenance } from "./maintenance.js";
import { showPacking } from "./packing.js";
import { showProjects } from "./projects.js";

const views = {
  inventory: showInventory,
  projects: showProjects,
  packing: showPacking,
  maintenance: showMaintenance,
};

/**
 * Initialize simple client-side view routing.
 */
const initApp = () => {
  const navButtons = document.querySelectorAll("[data-view]");
  let activeView = "inventory";

  const renderView = (viewName) => {
    activeView = viewName;

    if (!hasAuthToken()) {
      renderLoginView({
        message: "Sign in to access LS-Inventory.",
        onSuccess: () => renderView(activeView),
      });
      return;
    }

    const view = views[viewName] || showInventory;
    view();
  };

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const { view } = button.dataset;
      if (view) {
        renderView(view);
      }
    });
  });

  renderView("inventory");
};

initApp();
