import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { endOfMonth, isAfter, isBefore, startOfMonth } from "date-fns";
import lodash from "lodash";
import { useRouter } from "next/router";

import {
  REQUEST_STATUS,
  RejectModal,
  RequestStatus,
} from "../../../../../components/shared";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../../hooks/useRequest";
import { getMedicalRecordsReq } from "../../../../../modules/firebase";
import {
  formatTimeStamp,
  getNearestBusinessDay,
} from "../../../../../modules/helper";
import {
  ACTION_BUTTONS,
  DatePicker,
  LongTypography,
  Select,
  TablePlaceholder,
  getActionButtons,
  successMessage,
} from "../../../../common";
import PerDay from "./PerDay";
import PerMonth from "./PerMonth";
import PerWeek from "./PerWeek";
import PerYear from "./PerYear";
import useFilter from "./useFilter";

const ReportAppointment = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { openResponseDialog, openErrorDialog, closeDialog } =
    useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getConsultations] = useRequest(
    getMedicalRecordsReq,
    setBackdropLoader
  );

  // Local States
  const [consultations, setConsultations] = useState([]);

  const filtering = useFilter({
    defaultStartDate: startOfMonth(new Date()),
    defaultEndDate: endOfMonth(new Date()),
  });

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await getConsultations();
      if (error) return openErrorDialog(error);

      setConsultations(data);
      filtering.setData(data);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartateChange = (value) => {
    const v = value ? formatTimeStamp(value) : "";

    if (
      filtering.filters.endDate &&
      isAfter(new Date(v), new Date(filtering.filters.endDate))
    ) {
      return filtering.onEndDateChange(v);
    }

    filtering.onStartDateChange(v);
  };

  const handleEndDateChange = (value) => {
    const v = value ? formatTimeStamp(value) : "";

    if (
      filtering.filters.startDate &&
      isBefore(new Date(v), new Date(filtering.filters.startDate))
    ) {
      return filtering.onStartDateChange(v);
    }

    filtering.onEndDateChange(v);
  };

  const handleRangeDisplayChange = (e) => {
    const v = e.target.value;
    filtering.setRangeDisplay(v);
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 2, display: "flex", flexDirection: "row", gap: 2 }}>
        <Box sx={{ width: 200 }}>
          <DatePicker
            label="Start Date"
            value={filtering.filters.startDate}
            onChange={handleStartateChange}
          />
        </Box>
        <Box sx={{ width: 200 }}>
          <DatePicker
            label="End Date"
            value={filtering.filters.endDate}
            onChange={handleEndDateChange}
          />
        </Box>

        <Box sx={{ width: 200 }}>
          <Select
            value={filtering.filters.rangeDisplay}
            label="Range Display"
            onChange={handleRangeDisplayChange}
          >
            <MenuItem value="perday" dense>
              Per Day
            </MenuItem>
            <MenuItem value="perweek" dense>
              Per Week
            </MenuItem>
            <MenuItem value="permonth" dense>
              Per Month
            </MenuItem>
            <MenuItem value="peryear" dense>
              Per Year
            </MenuItem>
          </Select>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        {filtering.filters.rangeDisplay === "perday" && (
          <PerDay
            data={filtering.filtered}
            start={filtering.filters.startDate}
            end={filtering.filters.endDate}
          />
        )}
        {filtering.filters.rangeDisplay === "permonth" && (
          <PerMonth
            data={filtering.filtered}
            start={filtering.filters.startDate}
            end={filtering.filters.endDate}
          />
        )}
        {filtering.filters.rangeDisplay === "perweek" && (
          <PerWeek
            data={filtering.filtered}
            start={filtering.filters.startDate}
            end={filtering.filters.endDate}
          />
        )}
        {filtering.filters.rangeDisplay === "peryear" && (
          <PerYear
            data={filtering.filtered}
            start={filtering.filters.startDate}
            end={filtering.filters.endDate}
          />
        )}
      </Box>
    </Box>
  );
};

export default ReportAppointment;
