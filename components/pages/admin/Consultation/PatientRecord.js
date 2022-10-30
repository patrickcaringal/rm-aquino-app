import React, { useState } from "react";

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
} from "@mui/material";
import axios from "axios";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import { getBaseApi } from "../../../../modules/env";
import { formatTimeStamp } from "../../../../modules/helper";
import { LongTypography, PdfFrame, TablePlaceholder } from "../../../common";

const PatientRecord = ({ data = [] }) => {
  const { openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [generateReferral] = useRequest(axios.post, setBackdropLoader);

  // Local States
  const [pdfFile, setPdfFile] = useState(null);

  const handleViewReferral = async (patient) => {
    try {
      const payload = {
        ...patient.referral,
        date: formatTimeStamp(patient.referral?.date, "MMMM dd, yyyy"),
      };
      const res = await generateReferral(getBaseApi("/pdf"), payload);
      setPdfFile(res?.data);
    } catch (error) {
      setBackdropLoader(false);
      openErrorDialog(error?.message);
    }
  };

  if (pdfFile) {
    return (
      <>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setPdfFile(null)}
          sx={{ mb: 1 }}
        >
          back to medical records
        </Button>
        <PdfFrame src={`${pdfFile}`} width="100%" height="600" />
      </>
    );
  }

  return (
    <Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                { text: "Date of Visit", sx: { width: 140 } },
                { text: "Doctor", sx: { width: 180 } },
                { text: "Service", sx: { width: 180 } },
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
            {data.map((i, index) => {
              const { id, date, service, doctor, diagnosis } = i;
              return (
                <TableRow key={index} id={id}>
                  <TableCell>{formatTimeStamp(date, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{doctor ? doctor : "-"}</TableCell>
                  <TableCell>{service ? service : "-"}</TableCell>
                  <TableCell>
                    {diagnosis ? (
                      <LongTypography text={diagnosis} whiteSpace="pre-line" />
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
            <TablePlaceholder visible={data.length === 0} colSpan={3} />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientRecord;
