/**
 * Build QR payload URL for a device identifier.
 */
export const buildDeviceQrPayload = (deviceId) => {
  const encodedDeviceId = encodeURIComponent(deviceId);
  return `${window.location.origin}/?device=${encodedDeviceId}`;
};

/**
 * TODO: Add camera scanner integration using native browser APIs.
 */
export const scanQrPlaceholder = () => {
  return null;
};
