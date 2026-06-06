/** JS files copied from frontend/public/js — ensure these are deployed under /js/ **/
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

const initApp = () => {
  const navButtons = document.querySelectorAll("[data-view]");
  let activeView = "inventory";

  const renderView = (viewName) => {
    activeView = viewName;
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
