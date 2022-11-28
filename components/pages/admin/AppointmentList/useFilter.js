import { useCallback, useEffect, useMemo, useState } from "react";

const useFilter = ({
  data = [],
  defaultName = "",
  defaultStatus = "all",
  defaultDate = "",
}) => {
  const [initialData, setInitialData] = useState(data);
  const [name, setName] = useState(defaultName);
  const [status, setStatus] = useState(defaultStatus);
  const [date, setDate] = useState(defaultDate);

  const filters = {
    status,
    date,
    name,
  };

  const filteredData = () => {
    let filtered = initialData;

    if (name) {
      filtered = filtered.filter((i) =>
        i.patientName.toUpperCase().includes(name.toUpperCase())
      );
    }

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

  const onNameChange = (value) => {
    setName(value);
  };

  return {
    filtered,
    setData,
    filters,
    onStatusChange,
    onDateChange,
    onNameChange,
  };
};

export default useFilter;
