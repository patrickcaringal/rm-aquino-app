import { useCallback, useEffect, useMemo, useState } from "react";

import { REQUEST_STATUS } from "../../../shared";

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
        if (status === "done") return i.status === REQUEST_STATUS.done;
        if (status === "approved") return i.status === REQUEST_STATUS.approved;
        if (status === "rejected") return i.status === REQUEST_STATUS.rejected;
        if (status === "for approval")
          return i.status === REQUEST_STATUS.forapproval;

        return true;
      });
    }

    if (date) {
      filtered = filtered.filter((i) => i.date === date);
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
