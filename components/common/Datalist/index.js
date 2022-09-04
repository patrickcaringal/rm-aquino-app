import React from "react";

import { Box } from "@mui/material";

const Datalist = ({ data, labelWidth = 100, labelAlignment = "left" }) => (
  <Box
    sx={{
      display: "grid",
      grid: "auto-flow / 0fr 1fr",
      alignItems: "center",
      rowGap: 1,
      columnGap: 3,
    }}
  >
    {data.map(({ label, value }, index) => (
      <React.Fragment key={index}>
        <Box
          sx={{
            minWidth: labelWidth,
            textAlign: labelAlignment,
            fontWeight: 500,
            height: "100%",
          }}
        >
          {label}
        </Box>
        <Box>{value}</Box>
      </React.Fragment>
    ))}
  </Box>
);

export default Datalist;
