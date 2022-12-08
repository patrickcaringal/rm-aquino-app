import React, { useCallback, useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
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
} from "@mui/material";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import {
  addDiagnosisReq,
  deleteDiagnosisReq,
  getDiagnosisReq,
  updateDiagnosisReq,
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
import TableCells from "./TableCells";

const defaultModal = {
  open: false,
  data: {},
};

const AffiliatesManagementPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getDiagnosis] = useRequest(getDiagnosisReq, setBackdropLoader);
  const [addDiagnosis] = useRequest(addDiagnosisReq, setBackdropLoader);
  const [updateDiagnosis] = useRequest(updateDiagnosisReq, setBackdropLoader);
  const [deleteDiagnosis] = useRequest(deleteDiagnosisReq, setBackdropLoader);

  // Local States
  const [diagnosis, setDiagnosis] = useState([]);
  const [manageModal, setManageModal] = useState(false);
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await getDiagnosis();
      if (error) return openErrorDialog(error);

      setDiagnosis(data);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filtering.setData(diagnosis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosis]);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

  const handleAdd = async (docs) => {
    const p = { docs };
    const { data: newDocs, error: addError } = await addDiagnosis(p);
    if (addError) return openErrorDialog(addError);

    // Successful
    setDiagnosis((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Diagnosis", newDocs.length),
        verb: "added",
      }),
      type: "SUCCESS",
      closeCb() {
        setManageModal(defaultModal);
      },
    });
  };

  const handleEdit = async (updatedDocs) => {
    const updatedDiagnosis = updatedDocs[0];
    const copy = [...diagnosis];
    const { latestDocs, updates } = localUpdateDocs({
      updatedDoc: updatedDiagnosis,
      oldDocs: copy,
    });

    // Update
    const p = { document: updates };
    const { error } = await updateDiagnosis(p);
    if (error) return openErrorDialog(error);

    // Success
    setDiagnosis(latestDocs);
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Diagnosis", verb: "updated" }),
      type: "SUCCESS",
      closeCb() {
        setManageModal(defaultModal);
      },
    });
  };

  const handleDeleteConfirm = (item) => {
    openResponseDialog({
      content: confirmMessage({ verb: "Delete", item: item.name }),
      type: "CONFIRM",
      actions: (
        <Button color="error" onClick={() => handleDelete(item)} size="small">
          delete
        </Button>
      ),
    });
  };

  const handleDelete = async (document) => {
    // Delete
    const { error: deleteError } = await deleteDiagnosis({ document });
    if (deleteError) return openErrorDialog(deleteError);

    // Success
    setDiagnosis((prev) => prev.filter((i) => i.id !== document.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Diagnosis", verb: "deleted" }),
      type: "SUCCESS",
    });
  };

  const handleManageModalOpen = () => {
    setManageModal({
      open: true,
      data: null,
    });
  };

  const handleManageModalClose = () => {
    setManageModal(defaultModal);
  };

  const handleEditModalOpen = (data) => {
    setManageModal({
      open: true,
      data,
    });
  };

  const handleRestoreRedirect = () => {
    // router.push(PATHS.ADMIN.SERVICES_RESTORE);
  };

  const handleSearchChange = useCallback(
    (e) => {
      pagination.goToPage(0);
      filtering.onNameChange(e?.target?.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.goToPage, filtering.onNameChange]
  );

  const handlePageChange = (event, value) => {
    pagination.goToPage(value - 1);
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <Input
          label="Search"
          value={filtering.filters.name}
          onChange={(e) => {
            filtering.onNameChange(e?.target?.value);
          }}
          sx={{ width: 300, mr: 2 }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={handleManageModalOpen}
          startIcon={<AddCircleIcon />}
        >
          add diagnosis
        </Button>
        {/* <Button
          size="small"
          onClick={handleRestoreRedirect}
          startIcon={<RestoreIcon />}
          sx={{ ml: 2 }}
        >
          restore service
        </Button> */}
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                { text: "Diagnosis", sx: { width: 300 } },
                { text: "Description" },
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
                      <IconButton
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
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination pagination={pagination} onChange={handlePageChange} />

      {manageModal.open && (
        <ManageModal
          open={manageModal.open}
          data={manageModal.data}
          onClose={handleManageModalClose}
          onSave={!manageModal.data ? handleAdd : handleEdit}
        />
      )}
    </Box>
  );
};

export default AffiliatesManagementPage;
