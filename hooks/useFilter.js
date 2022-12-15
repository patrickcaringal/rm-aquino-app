import { useCallback, useMemo, useState } from "react";

const useFilter = ({ data = [], defaultName = "" }) => {
  const [initialData, setInitialData] = useState(data);
  const [name, setName] = useState(defaultName);

  const filters = useMemo(
    () => ({
      name,
    }),
    [name]
  );

  const filteredData = useCallback(() => {
    let filtered = initialData;

    if (name) {
      filtered = filtered.filter((i) =>
        i.patientName.toUpperCase().includes(name.toUpperCase())
      );
    }

    return filtered;
  }, [initialData, name]);

  const filtered = filteredData();

  const setData = useCallback((data) => {
    setInitialData(data);
  }, []);

  const onNameChange = useCallback((value) => {
    setName(value);
  }, []);

  return { filtered, setData, filters, onNameChange };
};

export default useFilter;
