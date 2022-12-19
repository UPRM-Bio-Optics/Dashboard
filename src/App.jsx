import logo from "./logo.svg";
import "./App.css";
import { createTheme } from "@mui/system";
import { green } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import NavBar from "./components/NavBar";

function App() {
  // Theme
  const theme = createTheme({
    pallete: {
      primary: {
        main: green[500],
      },
      secondary: {
        main: green[500],
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <NavBar></NavBar>
      </ThemeProvider>
    </>
  );
}

export default App;
