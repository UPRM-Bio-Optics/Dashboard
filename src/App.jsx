import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import "./FixImport";

function App() {
	// const [scheme, setScheme] = useState("light");
	const [scheme, setScheme] = useState(
		window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
	);

	const theme = createTheme({
		palette: {
			mode: scheme,
			primary: {
				main: "#0F8F46",
			},
			secondary: {
				main: "#b57136",
			},
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<NavBar scheme={scheme} setScheme={setScheme}></NavBar>
		</ThemeProvider>
	);
}

export default App;
