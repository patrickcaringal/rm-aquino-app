import React, { useEffect } from "react";

import DangerousIcon from "@mui/icons-material/Dangerous";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { PATHS } from "../../../../components/common";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks/";
import { verifyPatientEmailReq } from "../../../../modules/firebase";

const EmailVerification = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog } = useResponseDialog();

  // Requests
  const [verifyPatientEmail] = useRequest(
    verifyPatientEmailReq,
    setBackdropLoader
  );

  const patientId = router.query.id;

  useEffect(() => {
    const fetch = async () => {
      const payload = { id: patientId };
      const { data, error: getError } = await verifyPatientEmail(payload);
      if (getError) {
        const errText = {
          "Unable to get Patient doc": "Invalid Verification Email Link.",
          "Patient email already verified": "Patient email already verified.",
        };

        openResponseDialog({
          title: "Verify Email",
          type: "CONFIRM",
          autoClose: false,
          content: (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <DangerousIcon sx={{ mr: 3, fontSize: 60 }} color="error" />
              <Typography variant="body1" gutterBottom>
                {errText[getError] || getError}
              </Typography>
            </Box>
          ),
          closeCb() {
            router.replace(PATHS.PUBLIC.ROOT);
          },
        });
        return;
      }

      // Success
      openResponseDialog({
        title: "Verify Email",
        type: "CONFIRM",
        autoClose: false,
        content: (
          <>
            <Typography variant="body1" gutterBottom>
              Successfully verified your email ({data.email})
            </Typography>
            <Typography variant="body2">
              Your account is now For Admin approval.
            </Typography>
          </>
        ),
        closeCb() {
          router.replace(PATHS.PUBLIC.ROOT);
        },
      });
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  return <></>;
};

export default EmailVerification;
