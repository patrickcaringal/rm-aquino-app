import React from "react";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const SelectComponent = ({
  required = false,
  label = "",
  value = "",
  onChange = () => {},
  onBlur = () => {},
  error = null,
  children,
  ...rest
}) => {
  return (
    <FormControl
      variant="filled"
      focused
      fullWidth
      size="small"
      required={required}
      error={!!error}
    >
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={onChange} onBlur={onBlur}>
        {children}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default SelectComponent;
