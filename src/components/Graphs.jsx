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
		<FormControl fullWidth sx={{ mt: 3.7 }}>
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
	const [graph, setGraph] = useState("Map");

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

		var url =
			"https://raw.githubusercontent.com/UPRM-Bio-Optics/Bathymetry-Observation-Boat/main/Data/echo_sounder/";

		if (sensor === "Spectrometer") {
			url =
				"https://raw.githubusercontent.com/UPRM-Bio-Optics/Bathymetry-Observation-Boat/main/Data/Spectrometer/csv/";
		}

		await fetch(url + file)
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
	};

	// ===================== Plotly =====================
	const colorscaleList = [
		"Jet",
		"Virdis",
		"Portland",
		"Picnic",
		"Electric",
		"Earth",
		"Blackbody",
		"RdBu",
		"Greys",
	];
	const [colorscale, setColorscale] = useState(colorscaleList[0]);
	const colorscales = (
		<FormControl fullWidth>
			<InputLabel id="colorscale-select">Colorscale</InputLabel>
			<Select
				labelId="colorscale-select"
				id="colorscale-select"
				value={colorscale}
				label="Colorscale"
				onChange={(e) => setColorscale(e.target.value)}
			>
				{colorscaleList.map((text, index) => (
					<MenuItem key={index} value={text}>
						{text}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
	const title = graph + " - " + file;
	const [width, setWidth] = useState(
		window.innerWidth >= 600 ? window.innerWidth * 0.7 : window.innerWidth * 0.8
	);
	const [height, setHeight] = useState(
		window.innerWidth >= 600
			? window.innerHeight * 0.85
			: window.innerWidth * 0.85
	);
	const [zoom, setZoom] = useState(window.innerWidth >= 600 ? 16 : 15);
	const [plot, setPlot] = useState(null);
	const handlePlot = () => {
		if (file === "") {
			return;
		}

		var data = {};
		var layout = {};

		if (graph === "Contour") {
			console.log("Plotting Contour...");
			data = [
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
					colorscale: colorscale,
				},
			];

			layout = {
				title: title,
				height: height,
				width: width,
				margin: {
					l: 70,
					r: 0,
					b: 40,
					t: 30,
				},
				paper_bgcolor: "rgba(0,0,0,0)",
				plot_bgcolor: "rgba(0,0,0,0)",
			};
		}

		if (graph === "Mesh") {
			console.log("Plotting Mesh...");
			data = [
				{
					x: x,
					y: y,
					z: z,
					type: "mesh3d",
					intensity: z,
					colorscale: colorscale,
				},
			];
			layout = {
				title: title,
				height: height,
				width: width,
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
						z: 1,
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
						// y: 1.1,
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
						pad: { r: 0, l: 0, t: 40, b: 0 },
						showactive: true,
						type: "buttons",
						// x: 0.05,
						xanchor: "left",
						// y: 0.95,
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
			};
		}

		if (graph === "Map") {
			console.log("Plotting Map...");

			data = [
				{
					lat: x,
					lon: y,
					z: z,
					type: "densitymapbox",
					colorscale: colorscale,
				},
			];
			layout = {
				title: title,
				autosize: false,
				height: height,
				width: width,
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
						lat: (Math.max(...x) + Math.min(...x)) / 2,
						lon: (Math.max(...y) + Math.min(...y)) / 2,
					},
					zoom: zoom,
				},
				xaxis: {
					title: "Latitude",
				},
				yaxis: {
					title: "Longuitud",
				},
				margin: {
					l: 0,
					r: 0,
					b: 0,
					t: 30,
				},
				paper_bgcolor: "rgba(0,0,0,0)",
				plot_bgcolor: "rgba(0,0,0,0)",
			};
		}

		if (graph === "Spectrum") {
			console.log("Plotting Spectrum...");

			data = [
				{
					x: x,
					y: y,
					type: "scatter",
					mode: "lines",
					line: { color: "green" },
				},
			];
			layout = {
				title: title,
				height: height,
				width: width,
				margin: {
					l: 70,
					r: 0,
					b: 40,
					t: 30,
				},
				xaxis: {
					title: "Intensity (au)",
				},
				yaxis: {
					title: "Wavelength (nm)",
				},
				paper_bgcolor: "rgba(0,0,0,0)",
				plot_bgcolor: "rgba(0,0,0,0)",
			};
		}

		setPlot(<Plot className="plot" data={data} layout={layout} />);
	};

	// ===================== Confirm =====================
	const [button, setButton] = useState("Confirm");

	const handleConfirm = async () => {
		console.log("Confirming...");

		setButton(<CircularProgress color="inherit" size={20} thickness={4} />);

		await handleData();

		setButton("Confirm");
	};

	// ===================== To Keep Track of =====================

	// Map files to sensor changes
	useEffect(() => {
		handleFileList(sensor);
	}, [sensor]);

	// Handle graph changes
	// useEffect(() => {
	// 	setWidth(window.innerWidth * 0.7);
	// 	setHeight(window.innerHeight * 0.85);
	// });

	// ===================== Return =====================
	return (
		<Grid
			container
			direction="row"
			justifyContent="flex-start"
			alignItems="flex-start"
			spacing={3}
		>
			<Grid className="graph" item xs={12} sm={3}>
				{/* <br /> */}
				{sensors}
				<br />
				<br />
				{files}
				<br />
				<br />
				{graphs}
				<br />
				<br />
				{sensor === "Echosounder" ? (
					<>
						{colorscales} <br />
						<br />{" "}
					</>
				) : (
					<></>
				)}

				<Button
					variant="contained"
					sx={{ width: 100, height: 40 }}
					onClick={handleConfirm}
				>
					{button}
				</Button>
			</Grid>
			<Grid
				className="graph"
				item
				xs={12}
				sm={9}
				// sx={{ width: "100vw", height: "100vh" }}
			>
				{plot}
			</Grid>
		</Grid>
	);
}
