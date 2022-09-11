import React from "react";

import { Typography } from "@mui/material";

const LongTypography = ({
  text,
  displayedLines = 0,
  maxWidth = "none",
  color = "text.primary",
  whiteSpace = "normal",
}) => {
  return (
    <Typography
      variant="caption"
      sx={
        // displayedLines !== 0 && {
        //   display: "-webkit-box",
        //   WebkitBoxOrient: "vertical",
        //   WebkitLineClamp: `${displayedLines}`,
        //   overflow: "hidden",
        //   maxWidth,
        //   whiteSpace,
        // }
        {
          ...(displayedLines !== 0 && {
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: `${displayedLines}`,
            overflow: "hidden",
            maxWidth,
          }),
          whiteSpace,
        }
      }
      component="div"
      color={color}
    >
      {text}
    </Typography>
  );
};

export default LongTypography;
