import React, { useEffect, useState } from "react";

import FactCheckIcon from "@mui/icons-material/FactCheck";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { Toolbar } from "../../../components/common";
import { MemberApprovalModal } from "../../../components/pages/staff/MemberApproval";
import { useBackdropLoader } from "../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../contexts/ResponseDialogContext";
import useRequest from "../../../hooks/useRequest";
import {
  deleteImageReq,
  getMemberForApprovalReq,
  updateFamilyMembersReq,
} from "../../../modules/firebase";
import { getFullName } from "../../../modules/helper";
const LOCAL_MODE = false;

const MemberApprovalPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getMemberForApproval] = useRequest(
    getMemberForApprovalReq,
    setBackdropLoader
  );
  const [updateFamilyMembers] = useRequest(updateFamilyMembersReq);
  const [deleteImage] = useRequest(deleteImageReq);

  // Local States
  const [accounts, setAccounts] = useState([]); // used to pull Family members
  const [members, setMembers] = useState([]);
  const [memberApprovalModalState, setMemberApprovalModalState] = useState({
    open: false,
    data: null,
  });

  useEffect(() => {
    if (LOCAL_MODE) return;

    const fetch = async () => {
      // Get Members
      const { data: accountList, error: getMembersError } =
        await getMemberForApproval({});
      if (getMembersError) return openErrorDialog(getMembersError);

      setAccounts(accountList);
      const memberList = getMemberList(accountList);
      setMembers(memberList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMemberList = (accountList) => {
    const memberList = accountList.reduce((acc, m) => {
      let notVerifiedMember = m.familyMembers.filter(
        (i) =>
          !i.verified && i.verificationAttachment && !i.verificationRejectReason
      );

      // No Not Verified member, exit
      if (notVerifiedMember.length === 0) return acc;

      const requester = getFullName(m);
      notVerifiedMember = notVerifiedMember.map((i) => ({ ...i, requester }));

      return [...acc, ...notVerifiedMember];
    }, []);

    return memberList;
  };

  const updateMember = (
    accountId,
    memberName,
    approved,
    verificationRejectReason = ""
  ) => {
    const accountIndex = accounts.findIndex((i) => i.id === accountId);
    const updatedAccount = { ...accounts[accountIndex] };

    const memberIndex = updatedAccount.familyMembers.findIndex(
      (i) => getFullName(i) === memberName
    );

    const imageUrl =
      updatedAccount.familyMembers[memberIndex].verificationAttachment;

    updatedAccount.familyMembers[memberIndex].verified = approved;

    if (!approved) {
      updatedAccount.familyMembers[memberIndex].verificationRejectReason =
        verificationRejectReason;
    } else {
      delete updatedAccount.familyMembers[memberIndex].verificationRejectReason;
    }

    return { updatedAccount, accountIndex, imageUrl };
  };

  const handleMemberModalOpen = (m) => {
    const { verificationAttachment, requester, accountId } = m;
    setMemberApprovalModalState({
      open: true,
      data: {
        src: verificationAttachment,
        accountId,
        requester,
        member: getFullName(m),
      },
    });
  };

  const handleMemberModalClose = () => {
    setMemberApprovalModalState({
      open: false,
      data: null,
    });
  };

  const handleApprove = async ({ memberName, accountId }) => {
    setBackdropLoader(true);

    const { updatedAccount, accountIndex, imageUrl } = updateMember(
      accountId,
      memberName,
      true
    );

    // Update Family Member to verified
    const { error: updateFamMemberError } = await updateFamilyMembers({
      id: accountId,
      familyMembers: updatedAccount.familyMembers,
    });
    if (updateFamMemberError) {
      setBackdropLoader(false);
      return openErrorDialog(updateFamMemberError);
    }

    // Delete Image from Storage
    const { error: deleteImageError } = await deleteImage({
      url: imageUrl,
    });
    if (deleteImageError) {
      setBackdropLoader(false);
      return openErrorDialog(deleteImageError);
    }

    // Update Local State
    const accountsCopy = [...accounts];
    accountsCopy[accountIndex] = updatedAccount;
    setAccounts(accountsCopy);

    const memberList = getMemberList(accountsCopy);
    setMembers(memberList);

    setBackdropLoader(false);
    openResponseDialog({
      autoClose: true,
      content: "Member Verification approved.",
      type: "SUCCESS",
      closeCb() {
        handleMemberModalClose();
      },
    });
  };

  const handleReject = async ({
    memberName,
    accountId,
    verificationRejectReason,
  }) => {
    setBackdropLoader(true);

    const { updatedAccount, accountIndex, imageUrl } = updateMember(
      accountId,
      memberName,
      false,
      verificationRejectReason
    );

    // Update Family Member to verified
    const { error: updateFamMemberError } = await updateFamilyMembers({
      id: accountId,
      familyMembers: updatedAccount.familyMembers,
    });
    if (updateFamMemberError) {
      setBackdropLoader(false);
      return openErrorDialog(updateFamMemberError);
    }

    // Delete Image from Storage
    const { error: deleteImageError } = await deleteImage({
      url: imageUrl,
    });
    if (deleteImageError) {
      setBackdropLoader(false);
      return openErrorDialog(deleteImageError);
    }

    // Update Local State
    const accountsCopy = [...accounts];
    accountsCopy[accountIndex] = updatedAccount;
    setAccounts(accountsCopy);

    const memberList = getMemberList(accountsCopy);
    setMembers(memberList);

    setBackdropLoader(false);
    openResponseDialog({
      autoClose: true,
      content: "Member Verification rejected.",
      type: "SUCCESS",
      closeCb() {
        handleMemberModalClose();
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
        onRootClick={() => router.push("/staff/dashboard")}
        paths={[{ text: "Member Approval" }]}
      />

      <Box>
        <Paper
          elevation={2}
          sx={{ height: "calc(100vh - 64px - 64px - 16px)" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Requester</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {members.map((m, index) => {
                  const {
                    firstName,
                    suffix,
                    lastName,
                    middleName,
                    requester,
                    address,
                  } = m;

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {getFullName({
                          firstName,
                          suffix,
                          lastName,
                          middleName,
                        })}
                      </TableCell>
                      <TableCell>{requester}</TableCell>
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
                      <TableCell>
                        <IconButton
                          color="primary"
                          component="span"
                          onClick={() => handleMemberModalOpen(m)}
                        >
                          <FactCheckIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <MemberApprovalModal
        open={memberApprovalModalState.open}
        data={memberApprovalModalState.data}
        onClose={handleMemberModalClose}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Box>
  );
};

export default MemberApprovalPage;
