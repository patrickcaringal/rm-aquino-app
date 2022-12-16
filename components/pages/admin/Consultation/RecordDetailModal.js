import React, { useState } from "react";

import { Box, Button, Divider, Typography } from "@mui/material";
import faker from "faker";
import { jsPDF } from "jspdf";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import { getDoctorReq } from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import { Datalist, Modal } from "../../../common";
import MedicalCertificateModal from "./MedicalCertificateModal";
import PrescriptionModal from "./PrescriptionModal";

const defaultModal = {
  open: false,
  data: {},
};

const RecordDetailModal = ({ open = false, data, onClose }) => {
  const { openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getDoctor] = useRequest(getDoctorReq, setBackdropLoader);

  // Local States
  const [prescriptionModal, setPrescriptionModal] = useState(defaultModal);
  const [medicalCertModal, setMedicalCertModal] = useState(defaultModal);

  const {
    id,
    date,
    startTime,
    endTimeEstimate,
    patientName,
    patientId,
    service,
    doctor,
    diagnosis,
    medications,
    remarks,
    // vitals
    bodyTemperature,
    pulseRate,
    bloodPressure,
    height,
    weight,
  } = data;

  const appointmentData = [
    {
      label: "Appointment Date",
      value: formatTimeStamp(date, "MMM dd, yyyy (EEEE)"),
    },
    {
      label: "Appointment Time",
      value: `${startTime} - ${endTimeEstimate}`,
    },
    {
      label: "Service",
      value: `${service}`,
    },
    {
      label: "Patient Name",
      value: patientName,
    },
    // {
    //   label: "Age",
    //   value: birthdate ? calculateAge(formatTimeStamp(birthdate)) : "-",
    // },
    // {
    //   label: "Gender",
    //   value: gender ? gender : "-",
    // },
    {
      label: "Body Temperature",
      value: bodyTemperature ? `${bodyTemperature} °C` : "-",
    },
    {
      label: "Pulse Rate",
      value: pulseRate ? `${pulseRate} beats per minute` : "-",
    },
    {
      label: "Blood Pressure",
      value: bloodPressure ? bloodPressure : "-",
    },
    {
      label: "Height",
      value: height ? `${height} cm` : "-",
    },
    {
      label: "Weight",
      value: weight ? `${weight} kg` : "-",
    },
  ];

  const diagnosisData = [
    {
      label: "Doctor",
      value: doctor || "-",
    },
    {
      label: "Diagnosis",
      value: diagnosis || "-",
    },
  ];

  const handleClose = () => {
    onClose();
  };

  const handlePrescriptionModalOpen = (data) => {
    setPrescriptionModal({
      open: true,
      data,
    });
  };

  const handlePrescriptionModalClose = () => {
    setPrescriptionModal(defaultModal);
  };

  const handleMedicalCertModalOpen = (data) => {
    setMedicalCertModal({
      open: true,
      data,
    });
  };

  const handleMedicalCertModalClose = () => {
    setMedicalCertModal(defaultModal);
  };

  const handlePrintPrescription = async (i) => {
    const payload = { id: data.doctorId };
    const { data: d, error } = await getDoctor(payload);
    if (error) return openErrorDialog(error);

    const j = {
      date: data.date,
      patient: data.patientName,
      doctor: data.doctor,
      specialty: d.specialty,
      email: d.email,
      contactNo: d.contactNo,
    };
    exportPrescription({
      ...i,
      ...j,
    });
  };

  const handlePrintMedicalCert = async (i) => {
    exportMedCert(i);
  };

  return (
    <Modal
      fullScreen
      open={open}
      onClose={handleClose}
      title="Record Detail"
      maxWidth="lg"
      // maxWidth="100%"
      dialogActions={
        <>
          <Button color="inherit" size="small" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handlePrescriptionModalOpen(data)}
          >
            prescription
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleMedicalCertModalOpen(data)}
          >
            medical certificate
          </Button>
        </>
      }
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "calc(100vh - 150px)",
        }}
      >
        {/* Patient Details */}
        <Box>
          <Box sx={{ pr: 3, width: 480 }}>
            <Datalist data={appointmentData} labelWidth={150} />
          </Box>
        </Box>
        <Divider orientation="vertical" flexItem />

        <Box sx={{ px: 2 }}>
          <Datalist data={diagnosisData} />
          <Typography variant="body1" fontWeight="500" sx={{ my: 1 }}>
            Medications
          </Typography>

          <ul style={{ margin: 0 }}>
            {medications?.map((i, index) => (
              <li key={index}>
                <Typography>
                  {i.name} {i.dosage}, {i.frequency}
                </Typography>
                {!!i.remarks && (
                  <Typography variant="body2" fontStyle="italic">
                    {i.remarks}
                  </Typography>
                )}
              </li>
            ))}
          </ul>

          {!!remarks && (
            <>
              <Typography variant="body1" fontWeight="500" sx={{ my: 1 }}>
                Other Remarks
              </Typography>
              <Typography>{remarks}</Typography>
            </>
          )}
        </Box>
      </Box>

      {prescriptionModal.open && (
        <PrescriptionModal
          open={prescriptionModal.open}
          data={prescriptionModal.data}
          onClose={handlePrescriptionModalClose}
          onSave={handlePrintPrescription}
        />
      )}

      {medicalCertModal.open && (
        <MedicalCertificateModal
          open={medicalCertModal.open}
          data={medicalCertModal.data}
          onClose={handleMedicalCertModalClose}
          onSave={handlePrintMedicalCert}
        />
      )}
    </Modal>
  );
};

export default RecordDetailModal;

const exportPrescription = (data) => {
  const { medications, date, patient, doctor, specialty, email, contactNo } =
    data;

  const doc = new jsPDF("p", "mm", "junior-legal");
  const baseX = 8;
  const endX = 120;
  const baseY = 10;
  let movingY = baseY;

  doc.setFontSize(14);
  doc.text(`${doctor}`, 65, movingY, null, null, "center"); // name
  movingY += 4;

  doc.setFontSize(10);
  doc.text(`${specialty}`, 65, movingY, null, null, "center"); // specialty
  movingY += 4;

  doc.text(`RM Aquino Medical Clinic`, 65, movingY, null, null, "center"); // clinic
  movingY += 4;

  doc.text(`${email} | ${contactNo}`, 65, movingY, null, null, "center"); // email
  movingY += 4;

  doc.setLineWidth(0.5);
  doc.line(baseX, movingY, endX, movingY);
  movingY += 6;

  // ########################## content
  doc.setFontSize(10);
  doc.text(`${patient}`, baseX, movingY); // patient
  doc.text(
    `${formatTimeStamp(date, "MMM dd, yyyy")}`,
    endX,
    movingY,
    null,
    null,
    "right"
  ); // date
  movingY += 15;

  doc.setFontSize(20);
  doc.text(`R`, baseX, movingY);
  movingY += 2.5;
  doc.text(`x`, baseX + 3.3, movingY);
  movingY += 10;

  // ########################## medications
  const indent = 10;
  const medindent = baseX + indent;

  doc.setFontSize(10);
  medications.forEach((i) => {
    console.log(i);
    const q = i.quantity ? `, ${i.quantity} pc` : "";
    doc.text(`${i.name} ${i.dosage}${q} (${i.frequency})`, medindent, movingY); // name
    if (!!i.remarks) {
      movingY += 4;
      doc.text(i.remarks, medindent, movingY); // name
    }
    movingY += 10;
  });

  // ########################## footer

  doc.setFontSize(10);
  doc.text(`License #: ${faker.finance.account(5)}`, baseX, 192); // License #
  // movingY += 10;
  doc.text(`PRT #: ${faker.finance.account(5)}`, baseX, 196); // License #

  doc.output("pdfobjectnewwindow"); //opens the data uri in new window
};

const exportMedCert = (data) => {
  const { patientName, date, doctor, service, diagnosis, remarks } = data;

  const doc = new jsPDF();
  const baseX = 8;
  const endX = 200;
  const baseY = 10;
  let movingY = baseY;

  doc.setFontSize(14);
  doc.text(`RM Aquino Medical Clinic`, 105, movingY, null, null, "center"); // clinic
  movingY += 4;

  doc.setFontSize(10);
  doc.text(
    `JP Rizal St, Poblacion Uno, Cabuyao, 4026 Laguna`,
    105,
    movingY,
    null,
    null,
    "center"
  ); // address
  movingY += 4;

  doc.text("+63-2-8840-0588", 105, movingY, null, null, "center"); // address
  movingY += 4;

  doc.text(
    `https://rm-aquino-app.vercel.app/`,
    105,
    movingY,
    null,
    null,
    "center"
  ); // clinic
  movingY += 4;

  doc.setLineWidth(0.5);
  doc.line(baseX, movingY, endX, movingY);
  movingY += 6;

  // ########################## content
  movingY += 20;
  doc.setFontSize(12);
  const tab = `            `;
  const x = `${tab}This is to certify that ${patientName} visited RM Aquino Medical Clinic, JP Rizal St, Poblacion Uno, Cabuyao, 4026 Laguna and undergo ${service} with ${doctor} on ${date}. With the diagnosis of ${diagnosis}.`;

  doc.splitTextToSize(x, endX - 26).forEach((i) => {
    doc.text(i, baseX + 10, movingY);
    movingY += 8;
  });

  movingY += 8;
  doc.text(`${tab}${remarks}.`, baseX + 10, movingY);
  movingY += 8;

  // ########################## footer

  // doc.text(`License #: ${faker.finance.account(5)}`, baseX, endX - 26); // License #
  doc.line(endX - 60, movingY + 25, endX - 10, movingY + 25);

  doc.text(`Doctor Signature`, endX - 18, movingY + 31, null, null, "right"); // date

  doc.output("pdfobjectnewwindow"); //opens the data uri in new window
};
