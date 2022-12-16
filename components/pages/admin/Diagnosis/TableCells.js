import React from "react";

import { TableCell } from "@mui/material";

import { LongTypography } from "../../../common";

const TableCells = ({ data }) => {
  const { name, description } = data;

  return (
    <>
      <TableCell sx={{ width: 300 }}>{name}</TableCell>
      <TableCell>
        <LongTypography text={description} displayedLines={2} />
      </TableCell>
    </>
  );
};

export default TableCells;
