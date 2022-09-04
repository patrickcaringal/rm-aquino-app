import React from "react";

import { TableCell, TableRow, Typography } from "@mui/material";

const TablePlaceholder = ({ visible = fasle, colSpan = 1, children }) => {
  if (!visible) return null;

  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ textAlign: "center", height: 200 }}>
        {children || (
          <Typography color="text.secondary" fontWeight="medium">
            No Data to display
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TablePlaceholder;
