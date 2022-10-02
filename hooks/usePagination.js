import { useCallback, useEffect, useMemo, useState } from "react";

import lodash from "lodash";

const usePagination = (pageQuery, initialPageSize = 10, initialPage = 0) => {
  const [activePage, setActivePage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(pageQuery.length);

  const totalPages = Math.ceil(totalItems / pageSize);
  const pages = lodash.range(1, totalPages + 1);

  const pageInfo = useMemo(
    () => ({
      start: activePage * pageSize,
      end: (activePage + 1) * pageSize,
      activePage,
    }),
    [activePage, pageSize]
  );

  const goToPage = useCallback(
    (index) => {
      if (index < 0 || index > totalPages - 1) return;

      setActivePage(index);
    },
    [totalPages]
  );

  const nextPage = useCallback(
    () => goToPage(activePage + 1),
    [activePage, goToPage]
  );
  const prevPage = useCallback(
    () => goToPage(activePage - 1),
    [activePage, goToPage]
  );

  return useMemo(
    () => ({
      setTotalItems,
      pages,
      info: pageInfo,
      nextPage,
      prevPage,
      goToPage,
    }),
    [goToPage, nextPage, prevPage, pageInfo, pages]
  );
};

export default usePagination;
