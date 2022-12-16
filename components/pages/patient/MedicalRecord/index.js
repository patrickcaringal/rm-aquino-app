import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { addWeeks, isAfter, isBefore } from "date-fns";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import { getBaseApi } from "../../../../modules/env";
import { getPatientRecordReq } from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  TablePlaceholder,
  getActionButtons,
} from "../../../common";
import { DatePicker } from "../../../common/Form";
import RecordDetailModal from "./RecordDetailModal";
import ReferralModal from "./ReferralModal";
import useFilter from "./useFilter";

const defaultModal = {
  open: false,
  data: "",
};

const MedicalRecordPage = () => {
  const { user } = useAuth();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getPatientRecord] = useRequest(getPatientRecordReq, setBackdropLoader);
  const [generateReferral] = useRequest(axios.post, setBackdropLoader);

  // Local States
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [detailModal, setDetailModal] = useState(defaultModal);

  const filtering = useFilter({});

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      // Get Medical Record
      const payload = { id: user.id };
      const { data, error: getError } = await getPatientRecord(payload);
      if (getError) return openErrorDialog(getError);

      setMedicalRecords(data);
      filtering.setData(data);
    };

    fetchMedicalRecord();
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

  const handleDetailModalOpen = (data) => {
    setDetailModal({
      open: true,
      data,
    });
  };

  const handleDetailModalClose = () => {
    setDetailModal(defaultModal);
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 2, display: "flex", flexDirection: "row", gap: 2 }}>
        <Box sx={{ width: 200 }}>
          <DatePicker
            label="Start Date"
            value={filtering.filters.startDate}
            onChange={handleStartateChange}
            maxDate={addWeeks(new Date(), 1)}
          />
        </Box>
        <Box sx={{ width: 200 }}>
          <DatePicker
            label="End Date"
            value={filtering.filters.endDate}
            onChange={handleEndDateChange}
            maxDate={addWeeks(new Date(), 1)}
          />
        </Box>
      </Box>

      <Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  { text: "Date of Visit", sx: { width: 140 } },
                  { text: "Doctor", sx: { width: 220 } },
                  { text: "Service", sx: { width: 220 } },
                  { text: "Doctor Diagnosis" },
                  { text: "Actions", align: "center", sx: { width: 110 } },
                ].map(({ text, align, sx }) => (
                  <TableCell
                    key={text}
                    {...(align && { align })}
                    sx={{ ...sx, fontWeight: "bold", p: 2 }}
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtering.filtered.map((i, index) => {
                const { id, date, service, doctor, diagnosis } = i;
                return (
                  <TableRow key={index} id={id}>
                    <TableCell>
                      {formatTimeStamp(date, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{doctor ? doctor : "-"}</TableCell>
                    <TableCell>{service ? service : "-"}</TableCell>
                    <TableCell>{diagnosis}</TableCell>
                    <TableCell align="center">
                      {getActionButtons([
                        {
                          action: ACTION_BUTTONS.DETAILS2,
                          color: "success",
                          onClick: () => handleDetailModalOpen(i),
                        },
                      ])}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TablePlaceholder
                visible={filtering.filtered.length === 0}
                colSpan={5}
              />
            </TableBody>
          </Table>
        </TableContainer>

        {detailModal.open && (
          <RecordDetailModal
            open={detailModal.open}
            data={detailModal.data}
            onClose={handleDetailModalClose}
          />
        )}
      </Box>
    </Box>
  );
};

export default MedicalRecordPage;
