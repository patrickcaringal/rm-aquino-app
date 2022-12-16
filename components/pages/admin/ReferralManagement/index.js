import React, { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Autocomplete,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import { sendEmail } from "../../../../modules/email";
import { getBaseApi, getBaseUrl } from "../../../../modules/env";
import {
  getPatientsReq,
  getReferralsByPatientReq,
} from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  Input,
  Pagination,
  TablePlaceholder,
  confirmMessage,
  getActionButtons,
  successMessage,
} from "../../../common";
import ManageModal from "./ManageServiceModal";
import ReferPatientModal from "./ReferPatientModal";
import TableCells from "./TableCells";

const defaultModal = {
  open: false,
  data: {},
};

const ReferralManagementPage = () => {
  const { user } = useAuth();
  const { setBackdropLoader, closeBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog, closeDialog } =
    useResponseDialog();

  // Requests
  const [getReferralsByPatient] = useRequest(
    getReferralsByPatientReq,
    setBackdropLoader
  );
  const [getPatients] = useRequest(getPatientsReq, setBackdropLoader);
  const [sendReferral] = useRequest(axios.post, setBackdropLoader);

  // Local States
  const [referrals, setReferrals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [referModal, setReferModal] = useState(defaultModal);

  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

  useEffect(() => {
    const fetchPatient = async () => {
      const { data, error } = await getPatients();
      if (error) return openErrorDialog(error);

      const d = data.map((i) => ({ ...i, label: i.name }));
      setPatients(d);
    };

    // fetch();
    fetchPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filtering.setData(referrals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referrals]);

  useEffect(() => {
    const fetchReferrals = async (id) => {
      const p = { id };
      const { data, error } = await getReferralsByPatient(p);
      if (error) return openErrorDialog(error);

      setReferrals(data);
    };

    if (selectedPatient?.id) fetchReferrals(selectedPatient?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient]);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

  const handleReferModalOpen = () => {
    setReferModal({
      open: true,
      data: null,
    });
  };

  const handleSaveReferral = async (id) => {
    setSelectedPatient("");
    setTimeout(() => {
      setSelectedPatient(patients.find((i) => i.id === id));
    }, 500);
  };

  const handleReferModalClose = () => {
    setReferModal(defaultModal);
  };

  const handlePageChange = (event, value) => {
    pagination.goToPage(value - 1);
  };

  const handlePrintReferral = (d) => {
    exportReferral(d);
  };

  const handleSendEmail = async (d) => {
    try {
      const payload = d;
      await sendReferral(getBaseApi("/referral"), payload);

      openResponseDialog({
        autoClose: true,
        content: successMessage({
          noun: "Email referral",
          verb: "sent",
        }),
        type: "SUCCESS",
      });
    } catch (error) {
      closeBackdropLoader();
      openErrorDialog("Unable to send email.");
    }
  };

  const handleConfirmEmail = (d) => {
    openResponseDialog({
      title: "Send Referral Email",
      content: "Are you sure you want to send referral email?",
      type: "CONFIRM",
      actions: (
        <Button
          variant="contained"
          onClick={() => handleSendEmail(d)}
          size="small"
        >
          Send
        </Button>
      ),
    });
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <Autocomplete
          value={selectedPatient}
          disablePortal
          options={patients}
          onChange={async (event, newValue) => {
            setSelectedPatient(newValue);
          }}
          renderInput={(params) => (
            <Input {...params} label="Patient" placeholder="Select Patient" />
          )}
          sx={{ width: 300, mr: 2 }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={handleReferModalOpen}
          startIcon={<AddCircleIcon />}
        >
          refer patient
        </Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                { text: "Referrer", sx: { width: 300 } },
                { text: "Patient", sx: { width: 300 } },
                { text: "Affiliate", sx: { width: 300 } },
                { text: "Service" },
                { text: "Date", sx: { width: 140 } },
                { text: "Actions", align: "center", sx: { width: 110 } },
              ].map(({ text, align, sx }) => (
                <TableCell
                  key={text}
                  {...(align && { align })}
                  {...(sx && { sx: { ...sx, fontWeight: "bold" } })}
                >
                  {text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filtering.filtered
              .slice(pagination.info.start, pagination.info.end)
              .map((i) => {
                return (
                  <TableRow key={i.id}>
                    <TableCells data={i} />
                    <TableCell align="center">
                      {getActionButtons([
                        {
                          action: ACTION_BUTTONS.PRINT,
                          color: "success",
                          onClick: () => handlePrintReferral(i),
                        },
                        {
                          action: ACTION_BUTTONS.EMAIL,
                          color: "success",
                          onClick: () => handleConfirmEmail(i),
                        },
                      ])}
                    </TableCell>
                  </TableRow>
                );
              })}
            <TablePlaceholder
              visible={filtering.filtered.length === 0}
              colSpan={6}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination pagination={pagination} onChange={handlePageChange} />

      {referModal.open && (
        <ReferPatientModal
          open={referModal.open}
          onClose={handleReferModalClose}
          onSave={handleSaveReferral}
          referrer={user}
        />
      )}
    </Box>
  );
};

export default ReferralManagementPage;

const exportReferral = (data) => {
  const {
    affiliateName,
    patientName,
    serviceName,
    records,
    referrerName,
    remarks,
  } = data;

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
  movingY += 10;
  doc.setFontSize(12);
  const tab = `   `;
  const divider = `${tab}|${tab}`;
  const x = `To Whom It May Concern,\n\nI am referring ${patientName} to ${affiliateName} for evaluation and consideration for a ${serviceName}.`;

  doc.splitTextToSize(x, endX - 26).forEach((i) => {
    doc.text(i, baseX + 10, movingY);
    movingY += 8;
  });

  if (records?.length > 0) {
    movingY += 2;
    doc.text(
      `Below are the medical record history of the patient:`,
      baseX + 10,
      movingY
    );

    doc.setFontSize(10);
    movingY += 10;
    records?.forEach((i) => {
      doc.text(
        `${formatTimeStamp(i.date, "MMM dd, yyyy")}${divider}${
          i.doctor
        }${divider}${i.service}`,
        baseX + 10,
        movingY
      );
      movingY += 6;

      doc
        .splitTextToSize(
          `Diagnosis: ${i.diagnosis}${i.remarks ? `, ${i.remarks}` : ""}`,
          endX - 26
        )
        .forEach((j) => {
          doc.text(j, baseX + 10, movingY);
          movingY += 6;
        });

      if (i?.medications?.length > 0) {
        doc.text(`Medications:`, baseX + 10, movingY);
        movingY += 6;
        i?.medications?.forEach((j) => {
          doc.text(
            `• ${j.name} ${j.dosage}, ${j.frequency}${
              j.remarks ? `, ${j.remarks}` : ""
            }`,
            baseX + 10,
            movingY
          );
          movingY += 6;
        });

        movingY += 10;
      }
    });
  }

  // ########################## footer
  doc.setFontSize(12);

  if (remarks) {
    movingY += 10;
    doc.splitTextToSize(remarks, endX - 26).forEach((j) => {
      doc.text(j, baseX + 10, movingY);
      movingY += 8;
    });
  }

  movingY += 16;
  doc.text(`Sincerly Yours,\nDR. ${referrerName}`, baseX + 10, movingY);

  doc.output("pdfobjectnewwindow"); //opens the data uri in new window
};
