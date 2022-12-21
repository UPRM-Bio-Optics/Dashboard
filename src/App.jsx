import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
import NavBar from "./components/NavBar";

function App() {
	const theme = createTheme({
		palette: {
			mode: "dark",
			primary: {
				main: "#457130",
			},
			secondary: {
				main: "#b57136",
			},
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<NavBar></NavBar>
		</ThemeProvider>
	);
}

export default App;
