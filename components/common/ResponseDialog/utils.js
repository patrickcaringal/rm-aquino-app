export const successMessage = ({ noun = "Item", verb = "" }) => {
  return `Successfully ${verb} ${noun}.`;
};

export const duplicateMessage = ({ noun = "Item", item }) => {
  return `Duplicate ${noun} (${item})`;
};

export const confirmMessage = ({ verb, item }) => {
  return `Are you sure you want to ${verb} ${item}.`;
};
