import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import "./FixImport"

function App() {
	const [scheme, setScheme] = useState("light");

	// color schemes
	const darkScheme = {
		palette: {
			mode: "dark",
			primary: {
				main: "#457130",
				// light: "rgb(106, 141, 89)",
				// dark: "rgb(48, 79, 33)",
				// contrastText: "#fff",
			},
			secondary: {
				main: "#b57136",
			},
			// background: {
			// 	paper: "#303030",
			// 	default: "#424242",
			// },
			// text: {
			// 	primary: "#fff",
			// 	secondary: "rgba(255, 255, 255, 0.7)",
			// 	disabled: "rgba(255, 255, 255, 0.5)",
			// 	hint: "rgba(255, 255, 255, 0.5)",
			// },
		},
	};

	const lightScheme = {
		palette: {
			mode: "light",
			primary: {
				main: "#0F8F46",
			},
			secondary: {
				main: "#b57136",
			},
		},
	};

	const theme =
		scheme === "light" ? createTheme(lightScheme) : createTheme(darkScheme);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<NavBar scheme={scheme} setScheme={setScheme}></NavBar>
		</ThemeProvider>
	);
}

export default App;
