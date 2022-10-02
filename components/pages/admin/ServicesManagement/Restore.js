import React, { useEffect, useState } from "react";

import RestoreIcon from "@mui/icons-material/Restore";
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest, useSelect } from "../../../../hooks";
import {
  getDeletedServicesReq,
  restoreServiceReq,
} from "../../../../modules/firebase";
import { arrayStringify, pluralize } from "../../../../modules/helper";
import { successMessage } from "../../../common";
import TableCells from "./TableCells";

const ServicesRestorePage = () => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getServices] = useRequest(getDeletedServicesReq, setBackdropLoader);
  const [restoreService] = useRequest(restoreServiceReq, setBackdropLoader);

  // Local States
  const [services, setServices] = useState([]);
  const selected = useSelect("id");
  const selectedItems = selected.getSelected(services);

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

  const handleRestoreConfirm = () => {
    if (selectedItems.length === 0) return;

    const names = selectedItems.map((i) => i.name);
    openResponseDialog({
      title: "Restore Service",
      content: ` Are you sure you want to restore ${arrayStringify(names)}`,
      type: "CONFIRM",
      actions: (
        <Button color="error" onClick={handleRestore} size="small">
          restore
        </Button>
      ),
    });
  };

  const handleRestore = async () => {
    const items = selectedItems;
    const ids = selectedItems.map((i) => i.id);

    // Update
    const { error: restoreError } = await restoreService({ docs: items });
    if (restoreError) return openErrorDialog(restoreError);

    // Success
    setServices((prev) => prev.filter((i) => !ids.includes(i.id)));
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Service", items.length),
        verb: "restored",
      }),
      type: "SUCCESS",
    });
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleRestoreConfirm}
          startIcon={<RestoreIcon />}
        >
          restore
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 50 }} />
              {[
                { text: "Service", sx: { width: 200 } },
                { text: "Description" },
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
            {services.map((i) => {
              const { id } = i;
              const isItemSelected = selected.isItemSelected(id);

              return (
                <TableRow key={id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(e) => {
                        selected.select([{ id, checked: e.target.checked }]);
                      }}
                    />
                  </TableCell>
                  <TableCells data={i} />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ServicesRestorePage;
