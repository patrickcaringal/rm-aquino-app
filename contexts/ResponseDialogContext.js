import React, { createContext, useContext, useState } from "react";

import { ResponseDialog } from "../components/common";

const ResponseDialogContext = createContext({});

export const DIALOG_TYPES = {
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  ERROR: "ERROR",
  CONFIRM: "CONFIRM",
};

export const useResponseDialog = () => useContext(ResponseDialogContext);

export const ResponseDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(DIALOG_TYPES.SUCCESS);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [actions, setActions] = useState(null);

  const handleClose = () => {
    setOpen(false);

    // slight delay
    setTimeout(() => {
      setType(DIALOG_TYPES.SUCCESS);
      setTitle(null);
      setContent(null);
      setActions(null);
    }, 250);
  };

  const openResponseDialog = ({
    autoClose = false,
    title,
    content,
    actions,
    type,
    closeCb = () => {},
  }) => {
    setTitle(title);
    setType(type);
    setContent(content);
    setActions(actions);
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
    setActions(null);
    setOpen(true);

    setTimeout(() => {
      setOpen(false);
    }, 4000);
  };

  const value = {
    openErrorDialog,
    openResponseDialog,
    closeDialog: handleClose,
  };
  return (
    <ResponseDialogContext.Provider value={value}>
      <ResponseDialog
        open={open}
        type={type}
        title={title}
        content={content}
        actions={actions}
        onClose={handleClose}
      />
      {children}
    </ResponseDialogContext.Provider>
  );
};
