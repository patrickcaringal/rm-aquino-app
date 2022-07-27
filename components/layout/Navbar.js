import * as React from "react";

import AdbIcon from "@mui/icons-material/Adb";
import LogoutIcon from "@mui/icons-material/Logout";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
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
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { Logo } from "../../components";
import { useAuth } from "../../contexts/AuthContext";
import { useBackdropLoader } from "../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../contexts/ResponseDialogContext";
import useRequest from "../../hooks/useRequest";
import { signOutAnonymouslyReq, signOutReq } from "../../modules/firebase";
import { getFullName, getInitials } from "../../modules/helper";

const pages = ["Products", "Pricing", "Blog"];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

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
    // Sign Out Doctor, Staff
    if (isAdmin) {
      const { error: signOutError } = await signOutReq();
      if (signOutError) return openErrorDialog(signOutError);
      manualSetUser(null);
      setAnchorElUser(null);
      return;
    }

    // // Sign Out Patient
    // const { error: signOutError } = await signOutAnonymously(userSession);
    // if (signOutError) return openErrorDialog(signOutError);
    // manualSetUser(null);
    // setAnchorElUser(null);
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
        <Container maxWidth="lg">
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
          sx={{
            bgcolor: "primary.dark",
            height: "30px !important",
            minHeight: "30px !important",
          }}
        >
          <Container maxWidth={isAdminPanel ? "none" : "lg"}>
            {/* <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Typography color="common.white">LOGIN</Typography>
            </Breadcrumbs> */}
          </Container>
        </Toolbar>
      </AppBar>
      <Toolbar
        sx={{
          height: "110px !important",
          minHeight: "110px !important",
        }}
      />
    </>
  );
};
export default ResponsiveAppBar;

// {isLoggedIn ? (
//   <>
//     <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//       <Avatar sx={{ bgcolor: "primary.main" }}>
//         {getInitials(user?.firstName)}
//       </Avatar>
//     </IconButton>
//     <Menu
//       sx={{ mt: "45px" }}
//       id="menu-appbar"
//       anchorEl={anchorElUser}
//       anchorOrigin={{
//         vertical: "top",
//         horizontal: "right",
//       }}
//       keepMounted
//       transformOrigin={{
//         vertical: "top",
//         horizontal: "right",
//       }}
//       open={Boolean(anchorElUser)}
//       onClose={handleCloseUserMenu}
//     >
//       <Box sx={{ width: 260, p: 2 }}>
//         <Typography variant="body1" textAlign="center">
//           {getFullName(user).toUpperCase()}
//         </Typography>
//         <Typography variant="body2" textAlign="center">
//           {user?.email}
//         </Typography>
//         <Typography
//           variant="caption"
//           textAlign="center"
//           display="block"
//         >
//           {user?.role === "superadmin"
//             ? "Doctor"
//             : !user?.role
//             ? "Patient"
//             : user?.role}
//         </Typography>
//       </Box>
//       <Divider />
//       <MenuItem onClick={handleLogout}>
//         <ListItemIcon>
//           <LogoutIcon fontSize="small" />
//         </ListItemIcon>
//         <ListItemText>Logout</ListItemText>
//       </MenuItem>
//     </Menu>
//   </>
// ) : // displayed if page is not signin or signup
// !["/signin", "/signup", "/doctor/signin"].includes(
//     router.pathname
//   ) ? (
//   <Button
//     onClick={(e) => {
//       e.preventDefault();
//       router.push("/signin");
//     }}
//   >
//     Sign in
//   </Button>
// ) : null}
