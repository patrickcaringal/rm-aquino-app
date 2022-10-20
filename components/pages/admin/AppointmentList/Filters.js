import React from "react";

import { Box, MenuItem } from "@mui/material";

import { DatePicker, Select } from "../../../../components/common/Form";
import { formatTimeStamp } from "../../../../modules/helper";

const Filters = ({
  filters,
  onStatusChange,
  onDateChange,
  displayStatus = true,
}) => {
  const { status, date } = filters;
  return (
    <Box sx={{ mb: 2, display: "flex", flexDirection: "row", gap: 2 }}>
      {displayStatus && (
        <Box sx={{ width: 200 }}>
          <Select
            label="Status"
            value={status}
            onChange={(e) => {
              onStatusChange(e.target.value);
            }}
          >
            <MenuItem value="all" dense>
              All
            </MenuItem>
            <MenuItem value="for approval" dense>
              For Approval
            </MenuItem>
            <MenuItem value="approved" dense>
              Approved
            </MenuItem>
            <MenuItem value="rejected" dense>
              Rejected
            </MenuItem>
          </Select>
        </Box>
      )}

      <Box sx={{ width: 200 }}>
        <DatePicker
          label="Appointment Date"
          value={date}
          onChange={(value) => {
            if (!value || value == "Invalid Date") {
              return onDateChange("");
            }
            onDateChange(formatTimeStamp(value));
          }}
        />
      </Box>
    </Box>
  );
};

export default Filters;
