import app from "./app";

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
  // TODO: Replace with centralized logger once logging strategy is finalized.
  console.log(`LS-Inventory backend listening on port ${PORT}`);
});
