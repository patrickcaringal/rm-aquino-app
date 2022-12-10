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
import {
  ACTION_BUTTONS,
  LongTypography,
  PdfFrame,
  TablePlaceholder,
  getActionButtons,
} from "../../../common";
import RecordDetailModal from "./RecordDetailModal";

const defaultModal = {
  open: false,
  data: {},
};

const PatientRecord = ({ data = [] }) => {
  const { openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [generateReferral] = useRequest(axios.post, setBackdropLoader);

  // Local States
  // Local States
  const [detailModal, setDetailModal] = useState(defaultModal);

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
            {data.map((i, index) => {
              const { id, date, service, doctor, diagnosis } = i;
              return (
                <TableRow key={index} id={id}>
                  <TableCell>{formatTimeStamp(date, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{doctor ? doctor : "-"}</TableCell>
                  <TableCell>{service ? service : "-"}</TableCell>
                  <TableCell>
                    <LongTypography text={diagnosis} whiteSpace="pre-line" />
                    {/* {diagnosis ? (
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
                    )} */}
                  </TableCell>
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
            <TablePlaceholder visible={data.length === 0} colSpan={4} />
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
  );
};

export default PatientRecord;
