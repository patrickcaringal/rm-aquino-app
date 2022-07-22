import { useCallback, useMemo, useState } from "react";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
  usage: "sort",
});

const defaultSorter = (x, y) => {
  if (x == null) return y == null ? 0 : -1;
  if (y == null) return 1;
  return collator.compare(x, y);
};

const SORT_DIRECTIONS = {
  ASC: "asc",
  DESC: "desc",
};

const useSort = (sorters, defaultSortKey) => {
  const [sortBy, setSortBy] = useState(defaultSortKey || null);
  const [sortDir, setSortDir] = useState(SORT_DIRECTIONS.ASC);

  const getSorted = useCallback(
    (items) => {
      if (!sortBy) return [...items];

      const keySorter = sorters?.[sortBy];
      const sorter = keySorter || defaultSorter;
      const sorted = [...items].sort((x, y) => {
        return sorter(x[sortBy], y[sortBy], defaultSorter);
      });

      return sortDir === SORT_DIRECTIONS.ASC ? sorted : sorted.reverse();
    },
    [sortBy, sortDir, sorters]
  );

  return useMemo(
    () => ({
      setSortDir,
      setSortBy,
      getSorted,
      sortBy,
      sortDir,
    }),
    [getSorted, sortBy, sortDir]
  );
};

export default useSort;
