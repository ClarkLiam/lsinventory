import PDFDocument from "pdfkit";

/**
 * Create a basic PDF document instance.
 */
export const createPdfDocument = (): InstanceType<typeof PDFDocument> => {
  // TODO: Standardize document style and fonts for production exports.
  return new PDFDocument({ size: "A4", margin: 36 });
};
