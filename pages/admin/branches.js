import React, { useEffect, useState } from "react";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { omit as omitFields } from "lodash";
import { useRouter } from "next/router";

import { Toolbar } from "../../components/common";
import { ManageBranchModal } from "../../components/pages/doctor/BranchManagement";
import { useBackdropLoader } from "../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../contexts/ResponseDialogContext";
import useRequest from "../../hooks/useRequest";
import {
  addBranchReq,
  getBranchesReq,
  getServicesReq,
} from "../../modules/firebase";
import { pluralize } from "../../modules/helper";

const BranchManagementPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);
  const [addBranch] = useRequest(addBranchReq, setBackdropLoader);

  // Local States
  const [services, setServices] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [branches, setBranches] = useState([]);
  const [branchModalOpen, setBranchModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      // Get Services
      const {
        data: serviceList,
        map: serviceMap,
        error: getServiceError,
      } = await getServices();
      if (getServiceError) return openErrorDialog(getServiceError);

      setServices(
        serviceList.map((i) => ({
          ...omitFields(i, ["dateCreated", "dateUpdated", "description"]),
        }))
      );
      setServicesMap(serviceMap);
    };

    const fetchBranches = async () => {
      // Get Branches
      const { data: branchList, error: getBranchError } = await getBranches();
      if (getBranchError) return openErrorDialog(getBranchError);

      setBranches(branchList);
    };

    fetchServices();
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBranchModalOpen = () => {
    setBranchModalOpen(true);
  };

  const handleAddBranch = async (newBranch) => {
    // Add Branch
    const { data: addedBranch, error: addBranchError } = await addBranch({
      docs: newBranch,
    });
    if (addBranchError) return openErrorDialog(addBranchError);

    // Successful
    setBranches((prev) => [...prev, ...addedBranch]);

    openResponseDialog({
      autoClose: true,
      content: `${pluralize(
        "Branch",
        addedBranch.length,
        "es"
      )} successfuly added.`,
      type: "SUCCESS",
      closeCb() {
        setBranchModalOpen(false);
      },
    });
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        mx: 4,
      }}
    >
      <Toolbar
        onRootClick={() => router.push("/doctor/dashboard")}
        paths={[{ text: "Branches" }]}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleBranchModalOpen}
          startIcon={<GroupAddIcon />}
        >
          add branch
        </Button>
      </Toolbar>
      <Box>
        <Paper
          elevation={2}
          sx={{ height: "calc(100vh - 64px - 64px - 16px)" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Services</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Capacity</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {branches.map((i) => {
                  const { id, name, address, capacity, services } = i;

                  return (
                    <TableRow key={id}>
                      <TableCell>{name}</TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          {services.map((s) => (
                            <Chip
                              key={s.id}
                              label={servicesMap[s.id]}
                              color="primary"
                              size="small"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: "2",
                            overflow: "hidden",
                          }}
                          component="div"
                        >
                          {address}
                        </Typography>
                      </TableCell>
                      <TableCell>{capacity}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <ManageBranchModal
        services={services}
        open={branchModalOpen}
        setOpen={setBranchModalOpen}
        onAddBranch={handleAddBranch}
      />
    </Box>
  );
};

export default BranchManagementPage;
