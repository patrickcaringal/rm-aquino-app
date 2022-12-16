import React, { useEffect, useState } from "react";

import { Autocomplete, Box, Button } from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import {
  addReferralReq,
  getAffiliatesReq,
  getPatientRecordReq,
  getPatientsReq,
  getServicesReq,
} from "../../../../modules/firebase";
import { localUpdateDocs, pluralize } from "../../../../modules/helper";
import { ReferralSchema } from "../../../../modules/validation";
import { Input, Modal, successMessage } from "../../../common";

const defaultModal = {
  open: false,
  data: {},
};

const ReferPatientModal = ({ referrer, open, onClose, onSave }) => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getPatientsReq, setBackdropLoader);
  const [getAffiliates] = useRequest(getAffiliatesReq, setBackdropLoader);
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [addReferral] = useRequest(addReferralReq, setBackdropLoader);
  const [getPatientRecord] = useRequest(getPatientRecordReq, setBackdropLoader);

  // Local States
  const [patients, setPatients] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [services, setServices] = useState([]);

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

  const fetchPatientMedicalRecord = async (id) => {
    const { data, error } = await getPatientRecordReq({ id });
    if (error) return openErrorDialog(error);

    return data
      .slice(0, 3)
      .map((i) =>
        _.pick(i, [
          "date",
          "doctor",
          "service",
          "diagnosis",
          "remarks",
          "medications",
        ])
      );
  };

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
    onSubmit: async (values, { resetForm }) => {
      const records = await fetchPatientMedicalRecord(values.patientId);

      const p = {
        ...values,
        serviceName:
          values.serviceName === "Others"
            ? values.otherServiceName
            : values.serviceName,
        referrerName: referrer?.name,
        referrerId: referrer?.id,
        records,
      };
      delete p.otherServiceName;

      const { error } = await addReferral({ document: p });
      if (error) return openErrorDialog(error);

      openResponseDialog({
        autoClose: true,
        content: successMessage({
          noun: "Referral",
          verb: "saved",
        }),
        type: "SUCCESS",
        closeCb() {
          resetForm();
          handleClose();
          onSave(values.patientId);
        },
      });
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

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      fullScreen
      open={open}
      onClose={handleClose}
      title="Refer Patient"
      maxWidth="xl"
      dialogActions={
        <>
          <Button color="inherit" size="small" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" size="small" onClick={submitForm}>
            save referral
          </Button>
        </>
      }
    >
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
    </Modal>
  );
};

export default ReferPatientModal;
