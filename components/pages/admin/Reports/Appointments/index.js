import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { isAfter, isBefore } from "date-fns";
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
  TablePlaceholder,
  getActionButtons,
  successMessage,
} from "../../../../common";
import CollapsibleRow from "./CollapsibleRow";
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

  const filtering = useFilter({});

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await getConsultations();
      if (error) return openErrorDialog(error);

      const d = lodash
        .toPairs(lodash.chain(data).groupBy("date").value())
        .map(([k, v]) => ({
          date: k,
          data: v,
        }));

      setConsultations(d);
      filtering.setData(d);
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
      </Box>

      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 50 }} />
                {[
                  { text: "Date" },
                  { text: "Consultations", sx: { width: 210 } },
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
              {filtering.filtered.map((i) => {
                const { date } = i;
                return <CollapsibleRow key={date} data={i} />;
              })}
              <TablePlaceholder
                visible={filtering.filtered.length === 0}
                colSpan={3}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ReportAppointment;
