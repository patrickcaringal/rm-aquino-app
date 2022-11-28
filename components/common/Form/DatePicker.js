import React from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Input from "./Input";

const DatePickerComponent = ({
  required = false,
  label = "",
  name = "",
  value = "",
  onChange = () => {},
  onBlur = () => {},
  error = null,
  ...rest
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        inputFormat="MM/dd/yyyy"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        renderInput={(params) => (
          <Input {...params} required={required} name={name} error={error} />
        )}
        // maxDate={new Date()}
        {...rest}
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
