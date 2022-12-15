import React, { useCallback, useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import {
  addAffiliateReq,
  deleteAffiliateReq,
  getPatientsReq,
  getReferralsByPatientReq,
  getReferralsReq,
  updateAffiliateReq,
} from "../../../../modules/firebase";
import { localUpdateDocs, pluralize } from "../../../../modules/helper";
import {
  Input,
  PATHS,
  Pagination,
  confirmMessage,
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
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getReferralsByPatient] = useRequest(
    getReferralsByPatientReq,
    setBackdropLoader
  );
  const [getPatients] = useRequest(getPatientsReq, setBackdropLoader);

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
                      {/* <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditModalOpen(i)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteConfirm(i)}
                      >
                        <DeleteIcon />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                );
              })}
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
