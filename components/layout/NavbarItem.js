import * as React from "react";

import {
  Button,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";

const NavbarItem = ({ text, menuItems = [], selected }) => {
  const [itemEl, setItemEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setItemEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setItemEl(null);
  };

  return (
    <>
      <ListItemButton
        onClick={handleOpenMenu}
        sx={{
          maxWidth: 150,
          justifyContent: "center",
          bgcolor: selected ? "primary.light" : "primary",
        }}
        variant="text"
      >
        {text}
      </ListItemButton>
      <Menu
        sx={{ mt: "38px", ml: 1 }}
        id="basic-menu"
        anchorEl={itemEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(itemEl)}
        onClose={handleCloseMenu}
      >
        <MenuList dense sx={{ p: 0, minWidth: 160 }}>
          {menuItems.map(({ text, onClick }, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleCloseMenu();
                onClick();
              }}
            >
              <ListItemText>{text}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

export default NavbarItem;
