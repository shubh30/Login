import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#0ffa5a",
      main: "#04dc49",
      dark: "#03a035",
      contrastText: "#000000",
    },
    secondary: {
      light: "#ffffff",
      main: "#ffffff",
      dark: "#ebebeb",
      contrastText: "#00000",
    },
    error: {
      main: "#FF0000",
    },
  },
});

export default theme;