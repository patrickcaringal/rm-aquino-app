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
import { FormikProvider, useFormik } from "formik";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import {
  addAffiliateReq,
  deleteAffiliateReq,
  getAffiliatesReq,
  getPatientsReq,
  getServicesReq,
  updateAffiliateReq,
} from "../../../../modules/firebase";
import { localUpdateDocs, pluralize } from "../../../../modules/helper";
import { ReferralSchema } from "../../../../modules/validation";
import {
  Input,
  PATHS,
  Pagination,
  confirmMessage,
  successMessage,
} from "../../../common";
// import ManageModal from "./ManageServiceModal";
// import TableCells from "./TableCells";

const defaultModal = {
  open: false,
  data: {},
};

const AffiliatesManagementPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests

  const [getPatients] = useRequest(getPatientsReq, setBackdropLoader);
  const [getAffiliates] = useRequest(getAffiliatesReq, setBackdropLoader);
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);

  // const [addAffiliate] = useRequest(addAffiliateReq, setBackdropLoader);
  // const [updateAffiliate] = useRequest(updateAffiliateReq, setBackdropLoader);
  // const [deleteAffiliate] = useRequest(deleteAffiliateReq, setBackdropLoader);

  // Local States
  const [patients, setPatients] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [services, setServices] = useState([]);
  // const [manageModal, setManageModal] = useState(false);
  // const filtering = useFilter({});
  // const pagination = usePagination(filtering.filtered);

  useEffect(() => {
    const fetchPatient = async () => {
      const { data, error } = await getPatients();
      if (error) return openErrorDialog(error);

      const d = data.map((i) => ({ ...i, label: i.name }));
      setPatients(d);
    };

    const fetchtAffiliates = async () => {
      const { data, error } = await getAffiliates();
      if (error) return openErrorDialog(error);

      const d = data.map((i) => ({ ...i, label: i.name }));
      setAffiliates(d);
    };

    const fetchtServices = async () => {
      const { data, error } = await getServices();
      if (error) return openErrorDialog(error);

      const d = data.map((i) => ({ ...i, label: i.name }));
      d.push({ label: "Others", id: "", name: "Others" });
      setServices(d);
    };

    fetchPatient();
    fetchtAffiliates();
    fetchtServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      // affiliate
      affiliateId: "",
      affiliateName: "",
      affiliateAddress: "",
      affiliateEmail: "",
      // patient
      patientId: "",
      patientName: "",
      // service
      serviceId: "",
      serviceName: "",
      otherServiceName: "",
      // etc
      remarks: "",
    },
    validationSchema: ReferralSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    submitForm,
  } = formik;
  const getError = (field) => touched?.[field] && errors?.[field];

  return (
    <Box sx={{ pt: 2 }}>
      <Autocomplete
        value={values.affiliateName}
        disablePortal
        options={affiliates}
        onChange={(event, newValue) => {
          setFieldValue("affiliateId", newValue?.id);
          setFieldValue("affiliateName", newValue?.name);
          setFieldValue("affiliateAddress", newValue?.address);
          setFieldValue("affiliateEmail", newValue?.email);
        }}
        onBlur={handleBlur}
        renderInput={(params) => (
          <Input
            {...params}
            label="Affiliated Clinic / Doctor"
            placeholder="Select Affiliated Clinic / Doctor"
            name="affiliateName"
            error={getError("affiliateName")}
          />
        )}
        sx={{ mb: 2 }}
      />

      <Autocomplete
        value={values.patientName}
        disablePortal
        options={patients}
        onChange={(event, newValue) => {
          setFieldValue("patientId", newValue?.id);
          setFieldValue("patientName", newValue?.name);
        }}
        onBlur={handleBlur}
        renderInput={(params) => (
          <Input
            {...params}
            label="Patient"
            placeholder="Select Patient"
            name="patientName"
            error={getError("patientName")}
          />
        )}
        sx={{ mb: 2 }}
      />

      <Autocomplete
        value={values.serviceName}
        disablePortal
        options={services}
        onChange={(event, newValue) => {
          setFieldValue("serviceId", newValue?.id);
          setFieldValue("serviceName", newValue?.name);
          setFieldValue("otherServiceName", "");
        }}
        onBlur={handleBlur}
        renderInput={(params) => (
          <Input
            {...params}
            label="Service / Procedure"
            placeholder="Select Service / Procedure"
            name="serviceName"
            error={getError("serviceName")}
          />
        )}
        sx={{ mb: 2 }}
      />
      {values.serviceName === "Others" && (
        <Input
          value={values.otherServiceName}
          label="Other Service / Procedure"
          name="otherServiceName"
          onChange={handleChange}
          onBlur={handleBlur}
          error={getError("otherServiceName")}
          sx={{ mb: 2 }}
        />
      )}

      <Input
        multiline
        rows={3}
        value={values.remarks}
        label="Other remarks"
        name="remarks"
        onChange={handleChange}
        onBlur={handleBlur}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={submitForm}>
        save referral
      </Button>
    </Box>
  );
};

export default AffiliatesManagementPage;
