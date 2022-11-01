import { useCallback, useEffect, useMemo, useState } from "react";

import { isAfter, isBefore, isSameDay } from "date-fns";

const useFilter = ({
  data = [],
  defaultStartDate = "",
  defaultEndDate = "",
  rangeDisplay: defaultRangeDisplay = "permonth",
}) => {
  const [initialData, setInitialData] = useState(data);
  const [rangeDisplay, setRangeDisplay] = useState(defaultRangeDisplay);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const filters = {
    rangeDisplay,
    startDate,
    endDate,
  };

  const filteredData = () => {
    let filtered = initialData;

    if (startDate || endDate) {
      filtered = filtered.filter((i) => {
        const d1 = new Date(i.date);
        const d2 = new Date(startDate);
        const d3 = new Date(endDate);

        let isA = true;
        let isB = true;

        if (startDate) isA = isSameDay(d2, d1) || isAfter(d1, d2);
        if (endDate) isB = isSameDay(d3, d1) || isBefore(d1, d3);

        return isA && isB;
      });
    }

    return filtered;
  };

  const filtered = filteredData();

  const setData = (data) => {
    setInitialData(data);
  };

  const onStartDateChange = (value) => {
    setStartDate(value);
  };

  const onEndDateChange = (value) => {
    setEndDate(value);
  };

  return {
    filtered,
    setData,
    filters,
    onStartDateChange,
    onEndDateChange,
    setRangeDisplay,
  };
};

export default useFilter;
