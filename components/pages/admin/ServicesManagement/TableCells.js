import React from "react";

import { TableCell } from "@mui/material";

import { LongTypography } from "../../../../components/common";

const TableCells = ({ data }) => {
  const { id, name, description, price } = data;

  return (
    <>
      <TableCell sx={{ width: 250 }}>{name}</TableCell>
      <TableCell>
        <LongTypography text={description} displayedLines={2} />
      </TableCell>
      <TableCell sx={{ width: 250 }}>{price}</TableCell>
    </>
  );
};

export default TableCells;
