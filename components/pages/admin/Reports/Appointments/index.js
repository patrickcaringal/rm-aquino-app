import React, { useEffect, useState } from "react";

import DownloadIcon from "@mui/icons-material/Download";
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
import { endOfMonth, isAfter, isBefore, startOfMonth } from "date-fns";
import { jsPDF } from "jspdf";
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

  const filtering = useFilter({
    defaultStartDate: startOfMonth(new Date()),
    defaultEndDate: endOfMonth(new Date()),
  });

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
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => handleExport(filtering.filtered)}
        >
          Export
        </Button>
      </Box>

      <Box>
        <TableContainer>
          <Table size="small">
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

const handleExport = (data1) => {
  const doc = new jsPDF({ orientation: "landscape" });

  data1.forEach((i, idx) => {
    doc.setFontSize(14);
    const { date, data } = i;

    const baseX = 8;
    const baseY = 10;
    let movingY = baseY;

    const thead = [
      {
        name: "time",
        prompt: "Time",
      },
      {
        name: "patient",
        prompt: "Patient",
      },
      {
        name: "doctor",
        prompt: "Doctor",
      },
      {
        name: "service",
        prompt: "Service",
      },
    ];

    const tbody = data.map((j) => ({
      time: `${j.startTime} - ${j.endTimeEstimate}`,
      patient: j.patientName,
      doctor: j.doctor,
      service: j.service,
    }));

    doc.text(formatTimeStamp(date, "MMMM dd, yyyy"), baseX, movingY);
    movingY += 5;

    doc.table(baseX, movingY, tbody, thead, {
      autoSize: true,
      headerBackgroundColor: "#15A446",
      headerTextColor: "#fff",
      fontSize: 10,
    });

    if (idx + 1 !== data1.length) doc.addPage();
  });

  doc.output("pdfobjectnewwindow"); //opens the data uri in new window
};

export default ReportAppointment;
