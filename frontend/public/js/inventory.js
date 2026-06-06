import { apiRequest } from "./api.js";
import { hasAuthToken, logout, renderLoginView } from "./auth.js";
import { escapeHtml, render } from "./utils.js";

const STATUS_LABELS = {
  available: "Available",
  assigned: "Assigned",
  maintenance: "Maintenance",
};

const renderDeviceRows = (devices) =>
  devices
    .map(
      (device) => `
        <tr>
          <td>${escapeHtml(device.invCode)}</td>
          <td>${escapeHtml(device.unitId)}${device.optionalField ? ` / ${escapeHtml(device.optionalField)}` : ""}</td>
          <td>${escapeHtml(device.make)}</td>
          <td>${escapeHtml(device.model)}</td>
          <td>${escapeHtml(device.category)}</td>
          <td>${escapeHtml(device.locationName || "Storage")}</td>
          <td><span class="status-pill status-${escapeHtml(device.status)}">${escapeHtml(STATUS_LABELS[device.status] || device.status)}</span></td>
        </tr>
      `,
    )
    .join("");

const setStatusMessage = (message, isError = false) => {
  const status = document.querySelector("#inventory-status");

  if (status) {
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }
};

const loadDevices = async () => {
  const tableBody = document.querySelector("#device-list-body");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = `<tr><td colspan="7">Loading devices...</td></tr>`;

  try {
    const response = await apiRequest("/devices");
    const devices = Array.isArray(response?.data) ? response.data : [];

    if (!devices.length) {
      tableBody.innerHTML = `<tr><td colspan="7">No devices found yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = renderDeviceRows(devices);
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="7">Unable to load devices.</td></tr>`;
    setStatusMessage(error instanceof Error ? error.message : "Unable to load devices.", true);
  }
};

const submitDeviceForm = async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const payload = {
    invCode: String(formData.get("invCode") || "").trim(),
    unitId: String(formData.get("unitId") || "").trim(),
    optionalField: String(formData.get("optionalField") || "").trim(),
    make: String(formData.get("make") || "").trim(),
    model: String(formData.get("model") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    serialNumber: String(formData.get("serialNumber") || "").trim(),
  };

  if (formData.get("locationId")) {
    payload.locationId = Number(formData.get("locationId"));
  }

  const status = String(formData.get("status") || "available").trim();
  if (status) {
    payload.status = status;
  }

  setStatusMessage("Creating device...");

  try {
    await apiRequest("/devices", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    form.reset();
    setStatusMessage("Device created.");
    await loadDevices();
  } catch (error) {
    setStatusMessage(error instanceof Error ? error.message : "Unable to create device.", true);
  }
};

const bindInventoryActions = () => {
  const deviceForm = document.querySelector("#device-form");
  const logoutButton = document.querySelector("#inventory-logout");

  deviceForm?.addEventListener("submit", submitDeviceForm);
  logoutButton?.addEventListener("click", async () => {
    await logout();
    renderLoginView({ message: "You have been signed out.", onSuccess: showInventory });
  });
};

/**
 * Render inventory view.
 */
export const showInventory = () => {
  if (!hasAuthToken()) {
    renderLoginView({ message: "Sign in to view and create devices.", onSuccess: showInventory });
    return;
  }

  render(
    "#app",
    `
      <section class="page-shell">
        <div class="page-header page-header-split">
          <div>
            <p class="eyebrow">Inventory</p>
            <h2>Device list and creation</h2>
            <p>Manage inventory records, starting with a simple INV-XXXX create flow.</p>
          </div>
          <button id="inventory-logout" class="secondary-button" type="button">Sign out</button>
        </div>

        <p id="inventory-status" class="form-status" aria-live="polite"></p>

        <section class="panel">
          <h3>Create device</h3>
          <form id="device-form" class="device-form">
            <label>
              Inventory code
              <input name="invCode" type="text" placeholder="INV-0001" pattern="INV-[0-9]{4}" required />
            </label>
            <label>
              Unit ID
              <input name="unitId" type="text" placeholder="01" maxlength="2" pattern="[0-9]{2}" required />
            </label>
            <label>
              Optional field
              <input name="optionalField" type="text" placeholder="00" maxlength="2" pattern="[0-9]{2}" />
            </label>
            <label>
              Make
              <input name="make" type="text" placeholder="Shure" required />
            </label>
            <label>
              Model
              <input name="model" type="text" placeholder="SM58" required />
            </label>
            <label>
              Category
              <input name="category" type="text" placeholder="Microphone" required />
            </label>
            <label>
              Serial number
              <input name="serialNumber" type="text" placeholder="Optional" />
            </label>
            <label>
              Status
              <select name="status">
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </label>
            <label>
              Location ID
              <input name="locationId" type="number" min="1" placeholder="Defaults to Storage" />
            </label>
            <button type="submit">Create device</button>
          </form>
        </section>

        <section class="panel">
          <h3>Devices</h3>
          <div class="table-wrap">
            <table class="device-table">
              <thead>
                <tr>
                  <th>INV</th>
                  <th>Unit</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="device-list-body">
                <tr><td colspan="7">Loading devices...</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>
    `,
  );

  bindInventoryActions();
  void loadDevices();
};
