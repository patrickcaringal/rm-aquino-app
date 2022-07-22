import React, { useEffect } from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";

import { ServicesSchema } from "../../../../modules/validation";
import Form from "./Form";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
  services: [],
};

export default function ManageServiceModal({ open, setOpen, onAddService }) {
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: ServicesSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { services } = values;

      // Add Serivce
      onAddService(services);
    },
  });

  const { handleSubmit, values, resetForm } = formik;

  useEffect(() => {
    if (!open) resetForm();
  }, [open, resetForm]);

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ overflow: "overlay" }}
      >
        <AppBar sx={{ position: "sticky" }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Add Service
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={values.services.length === 0}
              >
                save
              </Button>
              <Button color="inherit" onClick={handleClose}>
                Cancel
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Box sx={{ py: 2 }}>
          <FormikProvider value={formik}>
            <Container maxWidth="lg">
              <Form {...formik} />
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Dialog>
  );
}
