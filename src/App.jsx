import logo from "./logo.svg";
import "./App.css";
import { createTheme } from "@mui/system";
import { green } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import FullWidthTabs from "./components/TabPanel";

function App() {
  // Theme
  const theme = createTheme({
    // pallete: {
    //   primary: {
    //     main: green[500],
    //   },
    //   secondary: {
    //     main: green[500],
    //   },
    // },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <FullWidthTabs theme={theme}></FullWidthTabs>
      </ThemeProvider>
    </>
  );
}

export default App;
