export const successMessage = ({ noun = "Item", verb = "" }) => {
  return `Successfully ${verb} ${noun}.`;
};

export const duplicateMessage = ({ noun = "Item", item }) => {
  return `Duplicate ${noun} (${item})`;
};
