import { useCallback, useMemo, useState } from "react";

const useSelect = (selectId) => {
  const [selected, setSelected] = useState(new Set());

  const select = (items) => {
    const newSet = new Set(selected);

    items.forEach((item) => {
      const id = item?.[selectId];
      if (item.checked) newSet.add(id);
      else newSet.delete(id);
    });

    setSelected(newSet);
  };

  const isSelected = (items) => {
    const ids = items.map((item) => item?.[selectId]);
    let some = false;
    let every = true;

    ids.some((id) => {
      const has = selected.has(id);
      every = every && has;
      some = has || some;
      return !every && some;
    });

    if (every) return true;
    return some ? null : false;
  };

  const isItemSelected = (itemId) => selected.has(itemId);

  const getSelected = (items) => {
    return items.filter((item) => selected.has(item?.[selectId]));
  };

  return { select, getSelected, isSelected, isItemSelected };
};

export default useSelect;
