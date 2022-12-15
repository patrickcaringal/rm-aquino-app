import React from "react";

import { TableCell } from "@mui/material";

import { formatTimeStamp } from "../../../../modules/helper";

const TableCells = ({ data }) => {
  const { referrerName, affiliateName, patientName, serviceName, dateCreated } =
    data;

  return (
    <>
      <TableCell>{referrerName || "-"}</TableCell>
      <TableCell>{patientName}</TableCell>
      <TableCell>{affiliateName}</TableCell>
      <TableCell>{serviceName}</TableCell>
      <TableCell>{formatTimeStamp(dateCreated, "MMM dd, yyyy")}</TableCell>
    </>
  );
};

export default TableCells;
