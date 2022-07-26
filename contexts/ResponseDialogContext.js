import { createContext, useContext, useState } from "react";

import { ResponseDialog } from "../components";

const ResponseDialogContext = createContext({});

export const DIALOG_TYPES = {
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  ERROR: "ERROR",
};

export const useResponseDialog = () => useContext(ResponseDialogContext);

export const ResponseDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(DIALOG_TYPES.SUCCESS);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);

  const handleClose = () => {
    setOpen(false);

    // slight delay
    setTimeout(() => {
      setType(DIALOG_TYPES.SUCCESS);
      setTitle(null);
      setContent(null);
    }, 250);
  };

  const openResponseDialog = ({
    autoClose = false,
    content,
    type,
    closeCb = () => {},
  }) => {
    setType(type);
    setContent(content);
    setOpen(true);
    closeCb();

    if (autoClose) {
      setTimeout(() => {
        setOpen(false);
      }, 4000);
    }
  };

  const openErrorDialog = (content = "") => {
    setType("ERROR");
    setContent(content);
    setOpen(true);

    setTimeout(() => {
      setOpen(false);
    }, 4000);
  };

  const value = { openErrorDialog, openResponseDialog };
  return (
    <ResponseDialogContext.Provider value={value}>
      <ResponseDialog
        open={open}
        type={type}
        title={title}
        content={content}
        onClose={handleClose}
      />
      {children}
    </ResponseDialogContext.Provider>
  );
};
