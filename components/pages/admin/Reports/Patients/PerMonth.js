import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { eachMonthOfInterval } from "date-fns";
import { jsPDF } from "jspdf";
import lodash from "lodash";

import { formatTimeStamp } from "../../../../../modules/helper";

const PerMonth = ({ data, start, end }) => {
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
              { text: "Months" },
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

const generateKey = (d) => formatTimeStamp(d, "MMMM");

export const compute = ({ data, start, end }) => {
  const months = eachMonthOfInterval({
    start: new Date(start),
    end: new Date(end),
  });

  // init month total json
  let tData = months.reduce((a, i) => {
    const key = generateKey(i);
    a[key] = 0;

    return a;
  }, {});

  data.forEach((i) => {
    const k = generateKey(i.date);
    tData[k] += 1;
  });

  return { months, tData };
};

export const exportPdf = ({ tData }) => {
  const doc = new jsPDF();
  const baseX = 8;
  const baseY = 10;
  let movingY = baseY;

  const thead = [
    {
      name: "month",
      prompt: "Months",
    },
    {
      name: "patients",
      prompt: "No. of Patients",
      align: "right",
    },
  ];

  lodash.toPairs(tData).map(([k, v]) => ({}));

  const tbody = lodash.toPairs(tData).map(([k, v]) => ({
    month: k,
    patients: `${v}`,
  }));

  doc.text(`Patients Per Month`, baseX, movingY);
  movingY += 10;

  doc.table(baseX, movingY, tbody, thead, {
    autoSize: true,
    headerBackgroundColor: "#15A446",
    headerTextColor: "#fff",
  });
  doc.output("pdfobjectnewwindow"); //opens the data uri in new window
};

export default PerMonth;
