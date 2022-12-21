import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState } from "react";
import Plot from "react-plotly.js";

export default function Graphs() {
	const [sensor, setSensor] = useState("Echosounder");
	const handleSensor = (event) => {
		setSensor(event.target.value);

		if (event.target.value === "Spectrometer") {
			setGraph("Spectrum");
		} else {
			setGraph("Contour");
		}
	};

	const [graph, setGraph] = useState("Contour");
	const handleGraph = (event) => {
		setGraph(event.target.value);
	};

	const graphs = (
		<FormControl fullWidth>
			<InputLabel id="graph-select">Graph</InputLabel>
			{sensor === "Echosounder" ? (
				<Select
					labelId="graph-select"
					id="graph-select"
					value={graph}
					label="Graph"
					onChange={handleGraph}
				>
					<MenuItem value={"Contour"}>Contour</MenuItem>
					<MenuItem value={"Mesh"}>Mesh</MenuItem>
					<MenuItem value={"Map"}>Map</MenuItem>
				</Select>
			) : (
				<Select
					labelId="graph-select"
					id="graph-select"
					value={graph}
					label="Graph"
					onChange={handleGraph}
				>
					<MenuItem value={"Spectrum"}>Spectrum</MenuItem>
				</Select>
			)}
		</FormControl>
	);

	const sensors = (
		<FormControl fullWidth>
			<InputLabel id="sensor-select">Sensor</InputLabel>
			<Select
				labelId="sensor-select"
				id="sensor-select"
				value={sensor}
				label="Sensor"
				onChange={handleSensor}
			>
				<MenuItem value={"Echosounder"}>Echosounder</MenuItem>
				<MenuItem value={"Spectrometer"}>Spectrometer</MenuItem>
			</Select>
		</FormControl>
	);

	const handleConfirm = () => {
		console.log("Confirming...");
	};

	return (
		<Grid container>
			<Grid item xs={3}>
				{sensors}
				<br />
				<br />
				{graphs}
				<br />
				<br />
				<Button variant="contained" onClick={handleConfirm}>
					Confirm
				</Button>
			</Grid>
			<Grid item xs={9}>
				<Plot
					data={[
						{
							x: [1, 2, 3],
							y: [2, 6, 3],
							type: "scatter",
							mode: "lines+markers",
							marker: { color: "red" },
						},
						{ type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
					]}
					layout={{ title: "A Fancy Plot" }}
				/>
			</Grid>
		</Grid>
	);
}
