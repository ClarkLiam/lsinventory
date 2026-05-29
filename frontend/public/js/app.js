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

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const { view } = button.dataset;
      if (view && views[view]) {
        views[view]();
      }
    });
  });

  showInventory();
};

initApp();
