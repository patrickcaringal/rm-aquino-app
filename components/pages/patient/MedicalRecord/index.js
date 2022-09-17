import React, { useEffect, useState } from "react";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
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
import { isAfter, isBefore } from "date-fns";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import { getBaseApi } from "../../../../modules/env";
import { getPatientRecordReq } from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import { LongTypography } from "../../../common";
import { DatePicker } from "../../../common/Form";
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
  const [referralModal, setReferralModal] = useState(defaultModal);

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

  const handleViewReferral = async (patient) => {
    try {
      const payload = {
        ...patient.referral,
        date: formatTimeStamp(patient.referral?.date, "MMMM dd, yyyy"),
      };
      const res = await generateReferral(getBaseApi("/pdf"), payload);
      // setPdfFile(res?.data);

      setReferralModal({
        open: true,
        data: res?.data,
      });
    } catch (error) {
      setBackdropLoader(false);
      openErrorDialog(error?.message);
    }
  };

  const handleReferralModal = () => {
    setReferralModal(defaultModal);
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
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  { text: "Date of Visit", sx: { width: 140 } },
                  { text: "Reason for Visit" },
                  { text: "Doctor Diagnosis" },
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
                const { date, reasonAppointment, diagnosis } = i;
                return (
                  <TableRow key={index}>
                    <TableCell>
                      {formatTimeStamp(date, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <LongTypography
                        text={reasonAppointment}
                        whiteSpace="pre-line"
                      />
                    </TableCell>
                    <TableCell>
                      {diagnosis ? (
                        <LongTypography
                          text={diagnosis}
                          whiteSpace="pre-line"
                        />
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PictureAsPdfIcon />}
                          onClick={() => handleViewReferral(i)}
                        >
                          view referral
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {referralModal.open && (
        <ReferralModal
          open={referralModal.open}
          data={referralModal.data}
          onClose={handleReferralModal}
        />
      )}
    </Box>
  );
};

export default MedicalRecordPage;
