import React, { Fragment, useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import {
  calculateAge,
  formatTimeStamp,
  getFullName,
} from "../../../../modules/helper";

const CollapsibleRow = ({ data, onApprove, onReject }) => {
  const [detailRowOpen, setDetailRowOpen] = useState(false);

  const {
    id,
    firstName,
    suffix,
    lastName,
    middleName,
    gender,
    email,
    birthdate,
    dateCreated,
    address,
    name,
  } = data;

  return (
    <>
      <TableRow>
        <TableCell sx={{ width: 60 }}>
          <IconButton
            size="small"
            onClick={() => setDetailRowOpen(!detailRowOpen)}
          >
            {detailRowOpen ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{name}</Typography>
        </TableCell>
        <TableCell sx={{ width: 100 }}>
          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
            {gender}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: 100 }}>
          <Typography variant="body2">
            {calculateAge(formatTimeStamp(birthdate))}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: 150 }}>
          <Typography variant="body2">
            {formatTimeStamp(dateCreated, "MMM dd, yyyy")}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: 110 }} align="center">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onApprove(data)}
          >
            <ThumbUpIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => onReject(data)}>
            <ThumbDownIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Collapsed Row */}
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={6}>
          <Collapse in={detailRowOpen} timeout="auto" unmountOnExit>
            <Box
              sx={{
                display: "grid",
                grid: "auto-flow / 0fr 1fr",
                alignItems: "center",
                rowGap: 1,
                m: 2,
              }}
            >
              {[
                {
                  label: "Name",
                  value: name,
                },
                {
                  label: "Email",
                  value: email,
                },
                {
                  label: "Address",
                  value: (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: "2",
                        overflow: "hidden",
                      }}
                      component="div"
                    >
                      {address}
                    </Typography>
                  ),
                },
              ].map(({ label, value }, index) => (
                <Fragment key={index}>
                  <Box sx={{ minWidth: 100 }}>{label}</Box>
                  <Box sx={{ fontWeight: "500" }}>{value}</Box>
                </Fragment>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CollapsibleRow;
