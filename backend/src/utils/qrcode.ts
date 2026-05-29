import QRCode from "qrcode";

/**
 * Generate a QR code data URL from a payload string.
 */
export const generateQrDataUrl = async (payload: string): Promise<string> =>
  QRCode.toDataURL(payload, { errorCorrectionLevel: "M" });
