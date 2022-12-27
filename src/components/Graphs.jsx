import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

export default function Graphs() {
	// ===================== Sensors =====================
	const [sensor, setSensor] = useState("Echosounder");
	const handleSensor = (event) => {
		setSensor(event.target.value);

		if (event.target.value === "Spectrometer") {
			setGraph("Spectrum");
		} else {
			setGraph("Contour");
		}
		// handleFileList(event.target.value);
	};
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

	// ===================== Graphs =====================
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

	// ===================== Files =====================
	const [file, setFile] = useState("");
	const handleFile = (event) => {
		setFile(event.target.value);
	};
	const [fileList, setFileList] = useState([""]);
	const handleFileList = (value) => {
		setFile("");
		const repo =
			"https://api.github.com/repos/UPRM-Bio-Optics/Bathymetry-Observation-Boat/git/trees/main?recursive=1";

		fetch(repo)
			.then((response) => response.json())
			.then((data) => {
				var result = [];

				for (var i in data.tree) {
					if (
						value === "Echosounder" &&
						data.tree[i].path.includes("echo_sounder") &&
						data.tree[i].path.includes("csv")
					) {
						console.log("Echosouder file: ", data.tree[i].path);
						result.push(data.tree[i].path.replace("Data/echo_sounder/", ""));
					}
					if (
						value === "Spectrometer" &&
						data.tree[i].path.includes("Spectrometer") &&
						data.tree[i].path.includes(".csv")
					) {
						console.log("Spectrometer file: ", data.tree[i].path);
						result.push(
							data.tree[i].path.replace("Data/Spectrometer/csv/", "")
						);
					}
					// else {
					// 	console.log("No sensor selected");
					// }
				}

				setFileList(result);
			});
	};
	const files = (
		<FormControl fullWidth>
			<InputLabel id="file-select">File</InputLabel>
			<Select
				labelId="file-select"
				id="file-select"
				value={file}
				label="File"
				onChange={handleFile}
			>
				{fileList.map((text, index) => (
					<MenuItem key={index} value={text}>
						{text}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	// ===================== Confirm =====================
	const handleConfirm = () => {
		console.log("Confirming...");
		console.log(file);
		console.log(fileList);

		if (sensor === "Echosounder") {
			fetch(
				"https://raw.githubusercontent.com/UPRM-Bio-Optics/Bathymetry-Observation-Boat/main/Data/echo_sounder/" +
					file
			)
				.then((response) => response.text())
				.then((data) => console.log(data.split("\n")));
		}
	};

	// ===================== On Render =====================
	useEffect(() => {
		handleFileList(sensor);
	}, [sensor]);

	// ===================== Return =====================
	return (
		<Grid container spacing={1}>
			<Grid item xs={3}>
				{sensors}
				<br />
				<br />
				{graphs}
				<br />
				<br />
				{files}
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
					layout={{
						title: "A Fancy Plot",
						paper_bgcolor: "rgba(0,0,0,0)",
						plot_bgcolor: "rgba(0,0,0,0)",
					}}
				/>
			</Grid>
		</Grid>
	);
}
