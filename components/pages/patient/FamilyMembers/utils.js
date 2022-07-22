import FlakyIcon from "@mui/icons-material/Flaky";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { IconButton } from "@mui/material";

export const MEMBER_STATUS = {
  VERFIED: "VERFIED",
  FOR_VERIFICATION: "FOR_VERIFICATION",
  FOR_APPROVAL: "FOR_APPROVAL",
  REJECTED: "REJECTED",
};

export const icons = {
  [MEMBER_STATUS.VERFIED]: (
    <>
      <IconButton size="small" sx={{ pointerEvents: "none" }}>
        <VerifiedUserIcon color="success" />
      </IconButton>
      Verified
    </>
  ),
  [MEMBER_STATUS.FOR_VERIFICATION]: (
    <>
      <IconButton size="small" sx={{ pointerEvents: "none" }}>
        <NoAccountsIcon color="error" />
      </IconButton>
      To Verifiy
    </>
  ),
  [MEMBER_STATUS.FOR_APPROVAL]: (
    <>
      <IconButton size="small" sx={{ pointerEvents: "none" }}>
        <FlakyIcon color="warning" />
      </IconButton>
      For Staff Approval
    </>
  ),
  [MEMBER_STATUS.REJECTED]: (
    <>
      <IconButton size="small" sx={{ pointerEvents: "none" }}>
        <HighlightOffIcon color="error" />
      </IconButton>
      Rejected
    </>
  ),
};

export const statusUploadAllowed = [
  MEMBER_STATUS.FOR_VERIFICATION,
  MEMBER_STATUS.REJECTED,
];
