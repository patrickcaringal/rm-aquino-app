import React from "react";

import { Box, Typography } from "@mui/material";
import faker from "faker";
import { useFormik } from "formik";
import Image from "next/image";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { isMockDataEnabled } from "../../../../modules/env";
import { createPatientAccountReq } from "../../../../modules/firebase";
import { personBuiltInFields } from "../../../../modules/helper";
import { SignupSchema } from "../../../../modules/validation";
import Form from "./Form";

const defaultValue = isMockDataEnabled
  ? {
      firstName: faker.name.firstName().toUpperCase(),
      suffix: "",
      lastName: faker.name.lastName().toUpperCase(),
      middleName: faker.name.lastName().toUpperCase(),
      email: "patrickangelo.caringal@gmail.com", // faker.internet.email()
      contactNo: faker.phone.phoneNumber("09#########"),
      address: faker.lorem.paragraph().toUpperCase(),
      birthdate: faker.date.past(
        faker.datatype.number({
          min: 10,
          max: 50,
        })
      ),
      gender: faker.random.arrayElement(["male", "female"]),
      // password: "12345678",
    }
  : {
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      birthdate: "",
      gender: "",
      address: "",
      email: "",
      contactNo: "",
      // password: "",
    };

const SignUpPage = () => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const [createPatientAccount] = useRequest(
    createPatientAccountReq,
    setBackdropLoader
  );

  const formik = useFormik({
    initialValues: defaultValue,
    validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      const document = {
        ...values,

        ...personBuiltInFields(values),
      };

      const { error: createAccountError } = await createPatientAccount({
        document,
      });
      if (createAccountError) return openErrorDialog(createAccountError);

      // Success
      openResponseDialog({
        title: "Verify Account",
        type: "CONFIRM",
        autoClose: false,
        content: (
          <>
            <Typography variant="body1" gutterBottom>
              Veirfication link is sent to {values.email}
            </Typography>
            <Typography variant="body2">
              Click or Visit the link sent to you email to verify your account.
            </Typography>
          </>
        ),
        closeCb() {
          resetForm();
        },
      });

      // openResponseDialog({
      //   type: "SUCCESS",
      //   autoClose: true,
      //   content: (
      //     <>
      //       <Typography variant="body1">
      //         Patient account registration successful.
      //       </Typography>
      //       <Typography variant="body2">For Admin approval.</Typography>
      //     </>
      //   ),
      //   closeCb() {
      //     resetForm();
      //   },
      // });
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box sx={{ flex: 1, p: 10, mr: 6 }}>
        <Image
          src="/medical-prescription1.png"
          alt=""
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="contain"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 500,
          my: 3,
        }}
      >
        <Form {...formik} />
      </Box>
    </Box>
  );
};

export default SignUpPage;
