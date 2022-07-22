import React from "react";

import { TextField } from "@mui/material";

const InputComponent = ({
  placeholder = "",
  required = false,
  label = "",
  name = "",
  value = "",
  type = "text",
  multiline = false,
  rows = 1,
  onChange = () => {},
  onBlur = () => {},
  error = null,
  ...rest
}) => {
  return (
    <TextField
      type={type}
      variant="filled"
      focused
      placeholder={placeholder}
      size="small"
      required={required}
      fullWidth
      label={label}
      name={name}
      autoComplete="off"
      value={value}
      multiline={multiline}
      rows={rows}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={error}
      {...rest}
    />
  );
};

export default InputComponent;
