export const successMessage = ({ noun = "Item", verb = "" }) => {
  return `${noun} successfully ${verb}.`;
};

export const duplicateMessage = ({ noun = "Item", item }) => {
  return `Duplicate ${noun} (${item})`;
};
