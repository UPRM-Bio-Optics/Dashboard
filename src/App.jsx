import { ThemeProvider } from "@emotion/react";
import green from "@mui/material/colors/green";
import { createTheme, useTheme } from "@mui/system";
import "./App.css";
import NavBar from "./components/NavBar";
import logo from "./logo.svg";

function App() {
	// Theme
	// const theme = createTheme({
	// 	palette: {
	// 		type: "light",
	// 		primary: {
	// 			main: "#457130",
	// 		},
	// 		secondary: {
	// 			main: "#ffe420",
	// 		},
	// 	},
	// });

	// const theme = useTheme();

	return (
		<>
			{/* <ThemeProvider theme={theme}> */}
			<NavBar></NavBar>
			{/* </ThemeProvider> */}
		</>
	);
}

export default App;
