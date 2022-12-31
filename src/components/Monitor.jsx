import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import * as mqtt from "mqtt";

// function createData(depth, time, from) {
// 	return { depth, time, from };
// }

export default function Monitor() {
	// Data
	const rows = [];
	const [table, setTable] = useState(null);

	// MQTT connection
	const [broker, setBroker] = useState("broker.mqttdashboard.com");
	const [port, setPort] = useState("8000");
	const [id, setId] = useState("hq");
	const [topic, setTopic] = useState("bio-optics/bob");
	const [client, setClient] = useState(null);

	const handleConnect = () => {
		const url = "ws://" + broker + ":" + port + "/mqtt";

		console.log("Connecting to: ", url);

		const options = {
			// Clean session
			clean: true,
			connectTimeout: 4000,
			// Authentication
			clientId: id,
		};

		setClient(mqtt.connect(url, options));
	};

	const handleTest = () => {
		console.log("Testing...");
		client.publish("bio-optics/bob", "Testing 123!");
	};

	const handleDisconnect = () => {
		client.end(() => console.log("Ended connection."));
		setTable(null);
		setClient(null);
	};

	useEffect(() => {
		if (!client) {
			return;
		}

		console.log(client);

		client.on("connect", () => {
			console.log("Connected!");
			client.subscribe(topic, (error) => {
				if (error) {
					console.log("Subscribe to topics error", error);
					return;
				}
			});
			setTable(
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 250 }} aria-label="log table">
						<TableHead>
							<TableRow>
								<TableCell>id</TableCell>
								<TableCell align="left">Depth</TableCell>
								<TableCell align="left">Time</TableCell>
								<TableCell align="left">From</TableCell>
							</TableRow>
						</TableHead>
						<TableBody></TableBody>
					</Table>
				</TableContainer>
			);
		});

		client.on("error", (err) => {
			console.error("Connection error: ", err);
			handleDisconnect();
		});

		client.on("reconnect", () => {
			console.log("Reconnecting");
		});

		client.on("message", (topic, message) => {
			const payload = { topic, message: message.toString() };
			console.log(payload);
			rows.unshift({
				depth: message.toString(),
				time: Date().replace("GMT-0400 (Atlantic Standard Time)", ""),
				from: "bob",
			});
			console.log(rows);
			setTable(
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 250 }} aria-label="log table">
						<TableHead>
							<TableRow>
								<TableCell>id</TableCell>
								<TableCell align="left">Depth</TableCell>
								<TableCell align="left">Time</TableCell>
								<TableCell align="left">From</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row, index) => (
								<TableRow
									key={index}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
								>
									<TableCell component="th" scope="row">
										{rows.length - index - 1}
									</TableCell>
									<TableCell align="left">{row.depth}</TableCell>
									<TableCell align="left">{row.time}</TableCell>
									<TableCell align="left">{row.from}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			);
		});
	}, [client]);

	return (
		<>
			<Grid container spacing={1}>
				<Grid item>
					<TextField
						id="filled-basic"
						label="Broker"
						variant="filled"
						value={broker}
						onChange={(e) => setBroker(e.target.value)}
					/>
				</Grid>
				<Grid item>
					<TextField
						id="filled-basic"
						label="Port"
						variant="filled"
						value={port}
						onChange={(e) => setPort(e.target.value)}
					/>
				</Grid>
				<Grid item>
					<TextField
						id="filled-basic"
						label="Client ID"
						variant="filled"
						value={id}
						onChange={(e) => setId(e.target.value)}
					/>
				</Grid>
				<Grid item>
					<TextField
						id="filled-basic"
						label="Topic"
						variant="filled"
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
					/>
				</Grid>
				<Grid item>
					<Button variant="contained" onClick={handleConnect}>
						Connect
					</Button>
					<Button
						variant="contained"
						color="secondary"
						onClick={handleTest}
						sx={{ m: 1 }}
					>
						Test
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={handleDisconnect}
						sx={{ m: 1 }}
					>
						Stop
					</Button>
				</Grid>
				<Grid item xs={12}>
					{table}
				</Grid>
			</Grid>
		</>
	);
}
