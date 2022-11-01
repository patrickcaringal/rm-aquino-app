import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { eachWeekOfInterval, endOfWeek, startOfWeek } from "date-fns";
import lodash from "lodash";

import { formatTimeStamp } from "../../../../../modules/helper";

const generateKey = (d) =>
  `${formatTimeStamp(startOfWeek(d), "MMM-dd-yyyy")} to ${formatTimeStamp(
    endOfWeek(d),
    "MMM-dd-yyyy"
  )}`;

const compute = ({ data, start, end }) => {
  const weeks = eachWeekOfInterval({
    start: new Date(start),
    end: new Date(end),
  });

  // init month total json
  let tData = weeks.reduce((a, i) => {
    const key = generateKey(i);
    a[key] = 0;

    return a;
  }, {});

  data.forEach((i) => {
    const k = generateKey(new Date(i.date));
    tData[k] += 1;
  });

  return { tData };
};

const PerWeek = ({ data, start, end }) => {
  const { tData } = compute({
    data,
    start,
    end,
  });

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {[
              { text: "Weeks" },
              { text: "No. of Patients", align: "right", sx: { width: 210 } },
            ].map(({ text, align, sx }) => (
              <TableCell
                key={text}
                {...(align && { align })}
                sx={{ ...sx, fontWeight: "bold" }}
              >
                {text}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {lodash.toPairs(tData).map(([k, v]) => (
            <TableRow key={k}>
              <TableCell>{k}</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {v}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PerWeek;
