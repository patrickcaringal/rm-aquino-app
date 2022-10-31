import * as React from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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
import { getNavbarItems } from "./menuItems";
import NavbarItem from "./NavbarItem";

const pages = ["Products", "Pricing", "Blog"];

const ResponsiveAppBar = () => {
  const router = useRouter();
  const { userSession, user, manualSetUser, isAdmin, isPatient, isLoggedIn } =
    useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();
  const [signOutAnonymously] = useRequest(
    signOutAnonymouslyReq,
    setBackdropLoader
  );

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [itemEl, setItemElUser] = React.useState(null);

  const menuItems = getNavbarItems(user?.id, user?.role, router);

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
        {/* maxWidth={isAdmin ? "none" : "lg"} */}
        <Container maxWidth={isLoggedIn && isAdmin ? "none" : "lg"}>
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
                  <MenuItem
                    onClick={() => {
                      if (!isPatient) router.push(PATHS.ADMIN.PROFILE);
                      else router.push(PATHS.PATIENT.PROFILE);
                      handleCloseUserMenu();
                    }}
                  >
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}

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
          <Container maxWidth={isAdmin ? "none" : "lg"}>
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
