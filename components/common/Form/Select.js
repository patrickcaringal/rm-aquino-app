import React from "react";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const SelectComponent = ({
  multiple = false,
  required = false,
  label = "",
  value = "",
  onChange = () => {},
  onBlur = () => {},
  error = null,
  children,
  sx,
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
      sx={sx}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        multiple={multiple}
        onChange={onChange}
        onBlur={onBlur}
        {...rest}
      >
        {children}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default SelectComponent;
