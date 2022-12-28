import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import CircularProgress from "@mui/material/CircularProgress";

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
						// console.log("Echosouder file: ", data.tree[i].path);
						result.push(data.tree[i].path.replace("Data/echo_sounder/", ""));
					}
					if (
						value === "Spectrometer" &&
						data.tree[i].path.includes("Spectrometer") &&
						data.tree[i].path.includes(".csv")
					) {
						// console.log("Spectrometer file: ", data.tree[i].path);
						result.push(
							data.tree[i].path.replace("Data/Spectrometer/csv/", "")
						);
					}
					// else {
					// 	console.log("No sensor selected");
					// }
				}

				setFileList(result);
				setFile(result[0]);
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

	// ===================== Data handeling =====================
	const [x, setX] = useState([]);
	const [y, setY] = useState([]);
	const [z, setZ] = useState([]);

	const handleData = async () => {
		console.log("Fetching Data...");
		if (sensor === "Echosounder") {
			await fetch(
				"https://raw.githubusercontent.com/UPRM-Bio-Optics/Bathymetry-Observation-Boat/main/Data/echo_sounder/" +
					file
			)
				.then((response) => response.text())
				.then((data) => data.split("\n"))
				.then(
					(csv) => {
						// buffers
						setX([]);
						setY([]);
						setZ([]);

						for (var i in csv) {
							csv[i] = csv[i].split(",");

							// Skip first index as it contains header text and skip empty rows
							if (i <= 0 || csv[i].includes("") || csv[i].includes(undefined)) {
								continue;
							}

							x.push(csv[i][0]);
							y.push(csv[i][1]);

							if (sensor === "Echosounder") {
								z.push(csv[i][2]);
							}
						}

						handlePlot();

						console.log(x, y, z);
					}
					// console.log("after split: ", csv);
				);
		}
	};

	// ===================== Plotly =====================
	const [plot, setPlot] = useState(<h4>Waiting for user input</h4>);
	const handlePlot = () => {
		if (file === "") {
			return;
		}

		if (graph === "Contour") {
			console.log("Plotting...");
			setPlot(
				<Plot
					data={[
						{
							x: x,
							y: y,
							z: z,
							type: "contour",
							contours: {
								coloring: "heatmap",
							},
							// ncontours: Math.max(...z_data),
							colorbar: {
								title: "Depth (ft)",
								titleside: "right",
							},
							colorscale: "Earth",
						},
					]}
					layout={{
						title: "Contour",
						height: 500,
						width: 900,
						margin: {
							l: 70,
							r: 0,
							b: 40,
							t: 30,
						},
						paper_bgcolor: "rgba(0,0,0,0)",
						plot_bgcolor: "rgba(0,0,0,0)",
					}}
				/>
			);
		}

		if (graph === "Mesh") {
			console.log("Plotting Mesh...");
			setPlot(
				<Plot
					data={[
						{
							x: x,
							y: y,
							z: z,
							type: "mesh3d",
							intensity: z,
							colorscale: "Earth",
						},
					]}
					layout={{
						title: "Mesh",
						height: 500,
						width: 900,
						scene: {
							xaxis: {
								title: "Longuitud",
								showgrid: true,
							},
							yaxis: {
								title: "Latitude",
								showgrid: true,
							},
							zaxis: {
								title: "Depth",
								autorange: "reversed",
								showgrid: true,
							},
							aspectmode: "manual",
							aspectratio: {
								x: 1,
								y: 1,
								z: 0.5,
							},
						},
						updatemenus: [
							{
								buttons: [
									{
										args: ["opacity", 1],
										label: "Solid",
										method: "restyle",
									},
									{
										args: ["opacity", 0.5],
										label: "Transparent",
										method: "restyle",
									},
								],
								direction: "left",
								pad: { r: 0, l: 0, t: 0, b: 0 },
								showactive: true,
								type: "buttons",
								// x: 0.05,
								xanchor: "left",
								y: 1.05,
								yanchor: "top",
								bgcolor: "rgb(255,255,255)",
							},
							{
								buttons: [
									{
										args: [
											{
												"scene.xaxis.visible": true,
												"scene.yaxis.visible": true,
												"scene.zaxis.visible": true,
											},
										],
										label: "Show Grid",
										method: "relayout",
									},
									{
										args: [
											{
												"scene.xaxis.visible": false,
												"scene.yaxis.visible": false,
												"scene.zaxis.visible": false,
											},
										],
										label: "Hide Grid",
										method: "relayout",
									},
								],
								direction: "left",
								pad: { r: 0, l: 0, t: 0, b: 0 },
								showactive: true,
								type: "buttons",
								// x: 0.05,
								xanchor: "left",
								y: 0.99,
								yanchor: "top",
								bgcolor: "rgb(255,255,255)",
							},
						],
						margin: {
							l: 0,
							r: 0,
							b: 0,
							t: 30,
						},
						paper_bgcolor: "rgba(0,0,0,0)",
						plot_bgcolor: "rgba(0,0,0,0)",
					}}
				/>
			);
		}

		if (graph === "Map") {
			console.log("Plotting Map...");
			setPlot(
				<Plot
					data={[
						{
							lon: x,
							lat: y,
							z: z,
							type: "densitymapbox",
							colorscale: "Earth",
						},
					]}
					layout={{
						title: "Map",
						mapbox: {
							style: "white-bg",
							layers: [
								{
									sourcetype: "raster",
									source: [
										"https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
									],
									below: "traces",
								},
							],
							center: {
								lon: (Math.max(...x) + Math.min(...x)) / 2,
								lat: (Math.max(...y) + Math.min(...y)) / 2,
							},
							zoom: 17,
						},
						xaxis: {
							title: "Longuitud",
						},
						yaxis: {
							title: "Latitude",
						},
						margin: {
							l: 0,
							r: 0,
							b: 0,
							t: 30,
						},
						paper_bgcolor: "rgba(0,0,0,0)",
						plot_bgcolor: "rgba(0,0,0,0)",
					}}
				/>
			);
		}
	};

	// ===================== Confirm =====================
	const [button, setButton] = useState("Confirm");

	const handleConfirm = async () => {
		console.log("Confirming...");

		setButton(<CircularProgress color="inherit" size={20} thickness={4} />);

		await handleData();

		setButton("Confirm");
	};

	// ===================== On Render =====================
	// const [loading, setLoading] = useState(false);
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
				<Button
					variant="contained"
					sx={{ width: 100, height: 40 }}
					onClick={handleConfirm}
				>
					{button}
				</Button>
			</Grid>
			<Grid item xs={9}>
				{plot}
			</Grid>
		</Grid>
	);
}
