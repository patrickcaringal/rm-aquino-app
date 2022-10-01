import React from "react";

import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import TodayIcon from "@mui/icons-material/Today";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import {
  days,
  formatTimeStamp,
  getDayOfWeek,
  today,
} from "../../../../modules/helper";

const PanelItem = ({ data }) => {
  const { icon, content1, content2, width = 180 } = data;

  const content1Props = {
    variant: "h2",
    fontWeight: "400",
    sx: { gridArea: "text1" },
    ...content1?.props,
  };

  const content2Props = {
    variant: "h5",
    sx: { gridArea: "text2" },
    ...content2?.props,
  };

  return (
    <>
      <CardContent sx={{ minWidth: width }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateAreas: `
                'icon text1'
                'icon text2'
            `,
          }}
        >
          <Box
            sx={{
              gridArea: "icon",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography {...content1Props}>{content1?.text}</Typography>
          <Typography {...content2Props}>{content2?.text}</Typography>
        </Box>
      </CardContent>
      <Divider orientation="vertical" flexItem />
    </>
  );
};

export default PanelItem;
