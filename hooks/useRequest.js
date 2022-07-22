import { useState } from "react";

const useLoading = (action, loadingAction) => {
  const [loading, setLoading] = useState(false);

  const doAction = async (...args) => {
    setLoading(true);
    loadingAction && loadingAction(true);
    const res = await action(...args);
    setLoading(false);
    loadingAction && loadingAction(false);
    return res;
  };

  return [doAction, loading];
};

export default useLoading;
