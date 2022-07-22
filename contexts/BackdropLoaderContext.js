import { createContext, useContext, useState } from "react";

import { BackdropLoader } from "../components";

const BackdropLoaderContext = createContext({});

export const useBackdropLoader = () => useContext(BackdropLoaderContext);

export const BackdropLoaderProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const openBackdropLoader = () => setOpen(true);
  const closeBackdropLoader = () => setOpen(false);
  const setBackdropLoader = (isOpen) => setOpen(isOpen);

  const value = { openBackdropLoader, closeBackdropLoader, setBackdropLoader };
  return (
    <BackdropLoaderContext.Provider value={value}>
      <BackdropLoader open={open} />
      {children}
    </BackdropLoaderContext.Provider>
  );
};
