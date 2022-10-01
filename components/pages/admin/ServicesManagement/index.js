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
  addServiceReq,
  deleteServiceReq,
  getServicesReq,
  updateServiceReq,
} from "../../../../modules/firebase";
import { localUpdateDocs, pluralize } from "../../../../modules/helper";
import {
  Input,
  PATHS,
  Pagination,
  confirmMessage,
  successMessage,
} from "../../../common";
import ManageServiceModal from "./ManageServiceModal";
import TableCells from "./TableCells";

const defaultModal = {
  open: false,
  data: {},
};

const ServicesManagementPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [addService] = useRequest(addServiceReq, setBackdropLoader);
  const [updateService] = useRequest(updateServiceReq, setBackdropLoader);
  const [deleteService] = useRequest(deleteServiceReq, setBackdropLoader);

  // Local States
  const [services, setServices] = useState([]);
  const [serviceModal, setServiceModal] = useState(false);
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

  useEffect(() => {
    const fetch = async () => {
      // Get Services
      const { data: serviceList, error: getServicesError } =
        await getServices();
      if (getServicesError) return openErrorDialog(getServicesError);

      setServices(serviceList);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filtering.setData(services);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services]);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

  const handleAddService = async (docs) => {
    // Add
    const { data: newDocs, error: addError } = await addService({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    // Successful
    setServices((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Service", newDocs.length),
        verb: "added",
      }),
      type: "SUCCESS",
      closeCb() {
        setServiceModal(defaultModal);
      },
    });
  };

  const handleEditService = async (updatedDocs) => {
    const updatedService = updatedDocs[0];
    const serviceCopy = [...services];
    const { latestDocs, updates } = localUpdateDocs({
      updatedDoc: updatedService,
      oldDocs: serviceCopy,
    });

    // Update
    const { error: updateError } = await updateService({
      service: updates,
    });
    if (updateError) return openErrorDialog(updateError);

    // Success
    setServices(latestDocs);
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Service", verb: "updated" }),
      type: "SUCCESS",
      closeCb() {
        setServiceModal(defaultModal);
      },
    });
  };

  const handleDeleteConfirm = (service) => {
    openResponseDialog({
      content: confirmMessage({ verb: "Delete", item: service.name }),
      type: "CONFIRM",
      actions: (
        <Button
          color="error"
          onClick={() => handleDelete(service)}
          size="small"
        >
          delete
        </Button>
      ),
    });
  };

  const handleDelete = async (service) => {
    // Delete
    const { error: deleteError } = await deleteService({ service });
    if (deleteError) return openErrorDialog(deleteError);

    // Success
    setServices((prev) => prev.filter((i) => i.id !== service.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Service", verb: "deleted" }),
      type: "SUCCESS",
    });
  };

  const handleServiceModalOpen = () => {
    setServiceModal({
      open: true,
      data: null,
    });
  };

  const handleServiceModalClose = () => {
    setServiceModal(defaultModal);
  };

  const handleEditServiceModalOpen = (service) => {
    setServiceModal({
      open: true,
      data: service,
    });
  };

  const handleRestoreRedirect = () => {
    router.push(PATHS.ADMIN.SERVICES_RESTORE);
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
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleServiceModalOpen}
          startIcon={<AddCircleIcon />}
        >
          add service
        </Button>
        <Button
          size="small"
          onClick={handleRestoreRedirect}
          startIcon={<RestoreIcon />}
          sx={{ ml: 2 }}
        >
          restore service
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { text: "Service", sx: { width: 200 } },
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
                        onClick={() => handleEditServiceModalOpen(i)}
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

      {serviceModal.open && (
        <ManageServiceModal
          open={serviceModal.open}
          data={serviceModal.data}
          onClose={handleServiceModalClose}
          onSave={!serviceModal.data ? handleAddService : handleEditService}
        />
      )}
    </Box>
  );
};

export default ServicesManagementPage;
