import * as React from "react";

import LogoutIcon from "@mui/icons-material/Logout";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import PlaceIcon from "@mui/icons-material/Place";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";

import { Logo } from "../../components";
import { PATHS } from "../../components/common/Routes";
import { useAuth } from "../../contexts/AuthContext";
import { useBackdropLoader } from "../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../contexts/ResponseDialogContext";
import useRequest from "../../hooks/useRequest";
import { signOutAnonymouslyReq, signOutReq } from "../../modules/firebase";
import { getFullName, getInitials } from "../../modules/helper";
import NavbarItem from "./NavbarItem";

const pages = ["Products", "Pricing", "Blog"];

const ResponsiveAppBar = () => {
  const router = useRouter();
  const {
    userSession,
    user,
    manualSetUser,
    isAdmin,
    isStaff,
    isLoggedIn,
    isAdminPanel,
  } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();
  const [signOutAnonymously] = useRequest(
    signOutAnonymouslyReq,
    setBackdropLoader
  );

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [itemEl, setItemElUser] = React.useState(null);

  const menuItems = isAdmin
    ? [
        ...(!isStaff
          ? [
              {
                text: "Staffs",
                icon: null,
                onClick: () => router.push(PATHS.ADMIN.STAFF_MANAGEMENT),
              },
            ]
          : []),
        {
          text: "Patients",
          icon: null,
          menuItems: [
            {
              text: "Patient List",
              onClick: () => router.push(PATHS.ADMIN.PATIENT_MANAGEMENT),
            },
            {
              text: "Patient Approval",
              onClick: () => router.push(PATHS.ADMIN.PATIENT_APPROVAL),
            },
          ],
        },
        {
          text: "Doctor Schedule",
          icon: null,
          menuItems: [
            {
              text: "Schedule This Week",
              onClick: () =>
                router.push(PATHS.ADMIN.DOCTOR_SCHEDULE_CURRENT_WEEK),
            },
            {
              text: "Schedule Next Week",
              onClick: () => router.push(PATHS.ADMIN.DOCTOR_SCHEDULE_NEXT_WEEK),
            },
          ],
        },
        {
          text: "Appointments",
          icon: null,
          menuItems: [
            {
              text: "Appointment List",
              onClick: () => router.push(PATHS.ADMIN.APPOINTMENT_MANAGEMENT),
            },
            {
              text: "Appointment Approval",
              onClick: () => router.push(PATHS.ADMIN.APPOINTMENT_CALENDAR),
            },
            // {
            //   text: "Old Approval",
            //   onClick: () => router.push(PATHS.ADMIN.APPOINTMENT_APPROVAL),
            // },
          ],
        },
        ...(!isStaff
          ? [
              {
                text: "Staffs",
                icon: null,
                onClick: () => router.push(PATHS.ADMIN.STAFF_MANAGEMENT),
              },
            ]
          : []),
        ,
      ]
    : [
        {
          text: "Medical Record",
          icon: null,
          onClick: () => router.push(PATHS.PATIENT.MEDICAL_RECORD),
        },
        {
          text: "Appointments",
          icon: null,
          onClick: () => router.push(PATHS.PATIENT.APPOINTMENT),
        },
        {
          text: "Schedule Appointment",
          icon: null,
          onClick: () => router.push(PATHS.PATIENT.SCHEDULE_APPOINTMENT),
        },
      ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    const { error: signOutError } = await signOutReq();
    if (signOutError) return openErrorDialog(signOutError);
    manualSetUser(null);
    setAnchorElUser(null);
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "common.white",
          // boxShadow:
          //   "0px 2px 4px -1px rgb(0, 0, 0, 0.05), 0px 4px 5px 0px rgb(0, 0, 0, 0.05), 0px 1px 10px 0px rgb(0, 0, 0, 0.05)",
        }}
      >
        {/* maxWidth={isAdminPanel ? "none" : "lg"} */}
        <Container maxWidth={isLoggedIn && isAdminPanel ? "none" : "lg"}>
          <Toolbar
            disableGutters
            sx={{ height: "80px !important", minHeight: "80px !important" }}
          >
            {/* Left */}
            <Box sx={{ flexGrow: 1, mt: 1 }}>
              <Logo width="160" height="70" />
            </Box>

            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="primary"
            >
              <PhoneAndroidIcon fontSize="large" />
            </IconButton>

            <Typography
              variant="body2"
              component="div"
              sx={{ color: "primary.dark", mr: 3 }}
            >
              +63-2-8840-0588
            </Typography>

            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="primary"
            >
              <PlaceIcon fontSize="large" />
            </IconButton>

            <Typography
              variant="caption"
              component="div"
              sx={{
                color: "primary.dark",
                width: 200,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: "2",
                overflow: "hidden",
              }}
            >
              JP Rizal St, Poblacion Uno, Cabuyao, 4026 Laguna
            </Typography>

            {isLoggedIn && (
              <>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {getInitials(user?.firstName)}
                  </Avatar>
                </IconButton>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box sx={{ width: 260, p: 2 }}>
                    <Typography variant="body1" textAlign="center">
                      {getFullName(user).toUpperCase()}
                    </Typography>
                    <Typography variant="body2" textAlign="center">
                      {user?.email}
                    </Typography>
                    <Typography
                      variant="caption"
                      textAlign="center"
                      display="block"
                    >
                      {user?.role === "superadmin"
                        ? "Doctor"
                        : !user?.role
                        ? "Patient"
                        : user?.role}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}

            {/* Mobile */}
            {/* <>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none" },
                  color: "black",
                }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none" },
                }}
              >
                <Logo width="160" height="56" />
              </Box>
            </> */}

            {/* Right */}
            <Box sx={{ flexGrow: 0 }}></Box>
          </Toolbar>
        </Container>
        <Toolbar
          disableGutters
          sx={{
            bgcolor: "primary.dark",
            height: "40px !important",
            minHeight: "40px !important",
          }}
        >
          <Container maxWidth={isAdminPanel ? "none" : "lg"}>
            {isLoggedIn &&
              menuItems.map(({ text, icon, onClick, menuItems }) => {
                if (!menuItems) {
                  return (
                    <Button
                      sx={{ color: "common.white", mr: 3 }}
                      key={text}
                      variant="text"
                      onClick={onClick}
                      startIcon={icon}
                    >
                      {text}
                    </Button>
                  );
                }

                return (
                  <NavbarItem key={text} text={text} menuItems={menuItems} />
                );
              })}
          </Container>
        </Toolbar>
      </AppBar>
      <Toolbar
        sx={{
          height: "120px !important",
          minHeight: "120px !important",
        }}
      />
    </>
  );
};
export default ResponsiveAppBar;
