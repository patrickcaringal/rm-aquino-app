import { useCallback, useEffect, useMemo, useState } from "react";

const useFilter = ({ data = [], defaultStatus = "all", defaultDate = "" }) => {
  const [initialData, setInitialData] = useState(data);
  const [status, setStatus] = useState(defaultStatus);
  const [date, setDate] = useState(defaultDate);

  const filters = {
    status,
    date,
  };

  const filteredData = () => {
    let filtered = initialData;

    if (status) {
      filtered = filtered.filter((i) => {
        if (status === "approved") return i.approved;
        if (status === "rejected") return i.rejected;
        if (status === "for approval") return !i.approved && !i.rejected;
        return true;
      });
    }

    return filtered;
  };

  const filtered = filteredData();

  const setData = (data) => {
    setInitialData(data);
  };

  const onStatusChange = (value) => {
    setStatus(value);
  };

  const onDateChange = (value) => {
    setDate(value);
  };

  return { filtered, setData, filters, onStatusChange, onDateChange };
};

export default useFilter;
