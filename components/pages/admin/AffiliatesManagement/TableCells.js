import React from "react";

import { TableCell } from "@mui/material";

import { LongTypography } from "../../../common";

const TableCells = ({ data }) => {
  const { name, email, address } = data;

  return (
    <>
      <TableCell sx={{ width: 300 }}>{name}</TableCell>
      <TableCell sx={{ width: 300 }}>{email}</TableCell>
      <TableCell>
        <LongTypography text={address} displayedLines={2} />
      </TableCell>
    </>
  );
};

export default TableCells;
