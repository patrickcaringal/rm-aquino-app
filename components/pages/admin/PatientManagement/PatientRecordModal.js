import React, { useEffect, useState } from "react";

import { Box, Button } from "@mui/material";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { getPatientRecordReq } from "../../../../modules/firebase";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import { Modal } from "../../../common";
import PatientRecord from "../Consultation/PatientRecord";

const ConsultModal = ({ open = false, data, onClose }) => {
  const { openErrorDialog, openResponseDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getPatientRecord] = useRequest(getPatientRecordReq, setBackdropLoader);

  // Local States
  const [medicalRecords, setMedicalRecords] = useState([]);

  const { id, name, birthdate, gender } = data;

  const appointmentData = [
    {
      label: "Patient Name",
      value: name,
    },
    {
      label: "Age",
      value: birthdate ? calculateAge(formatTimeStamp(birthdate)) : "-",
    },
    {
      label: "Birthdate",
      value: birthdate ? formatTimeStamp(birthdate, "MMM-dd-yyyy") : "-",
    },
    {
      label: "Gender",
      value: gender ? gender : "-",
    },
  ];

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      // Get Medical Record
      const payload = { id };
      const { data, error: getError } = await getPatientRecord(payload);
      if (getError) return openErrorDialog(getError);

      setMedicalRecords(data);
    };

    fetchMedicalRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Patient Medical Record"
      maxWidth="lg"
      dialogActions={
        <>
          <Button color="inherit" size="small" onClick={handleClose}>
            Close
          </Button>
        </>
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Patient Details */}
        <Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 8, mb: 3 }}>
            {appointmentData.map((i) => {
              return (
                <Box
                  key={i.label}
                  sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                >
                  <Box
                    sx={{
                      fontWeight: 500,
                      height: "100%",
                    }}
                  >
                    {i.label}:
                  </Box>
                  <Box>{i.value}</Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        {/* Patient Record */}
        <Box sx={{ flex: 1 }}>
          <PatientRecord data={medicalRecords} />
        </Box>
      </Box>
    </Modal>
  );
};

export default ConsultModal;
