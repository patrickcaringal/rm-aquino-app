import { createTheme } from "@mui/material/styles";

export const defaultTheme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#15a446",
      // dark: will be calculated from palette.primary.main,
      contrastText: "#fff",
    },
    secondary: {
      // light: will be calculated from palette.primary.main,
      main: "#004aad",
      // dark: will be calculated from palette.primary.main,
      contrastText: "#fff",
    },
  },
});
