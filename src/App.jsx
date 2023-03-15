import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Graphs from "./components/Graphs";
import Monitor from "./components/Monitor";
import Navbar from "./components/Navbar";

// Fix imports
import buffer from "buffer";
import process from "process";
window.Buffer = buffer.Buffer;
window.process = process;

// Main app component
function App() {
	// Set fixed color scheme
	const [scheme, setScheme] = useState("light");

	// Auto detect browser color scheme
	// const [scheme, setScheme] = useState(
	// 	window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
	// );

	// Application theme
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
			<Navbar scheme={scheme} setScheme={setScheme}></Navbar>
			<Routes>
				<Route path="/" element={<Navigate to="/graphs" />} />
				<Route path="/graphs" element={<Graphs />} />
				<Route path="/monitor" element={<Monitor />} />
			</Routes>
		</ThemeProvider>
	);
}

export default App;
