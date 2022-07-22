import React from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

export default function BasicMenu({ menuItems }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <MoreVertIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
        {menuItems.map(({ icon, text }, index) => (
          <MenuItem key={index} onClick={handleClose}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText>{text}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
