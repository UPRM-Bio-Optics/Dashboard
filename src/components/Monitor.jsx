import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import * as mqtt from "mqtt";
import { useEffect, useState } from "react";

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

export default function Monitor() {
	// Data
	const rows = [];
	const [table, setTable] = useState(null);

	const random_id = () => {
		return (
			"hq-" +
			Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1)
		);
	};
	// MQTT connection
	const [broker, setBroker] = useState("broker.hivemq.com");
	const [port, setPort] = useState("8884");
	const [id, setId] = useState(random_id);
	const [topic, setTopic] = useState("bio-optics/bob");
	const [client, setClient] = useState(null);

	const handleConnect = () => {
		const url = "wss://" + broker + ":" + port + "/mqtt";

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
		setDisconnected(true);
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
				client.publish(topic, id + " connected!");
			});

			setTable(
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 250 }} aria-label="log table">
						<TableHead>
							<TableRow>
								<TableCell>id</TableCell>
								<TableCell align="left">Message</TableCell>
								<TableCell align="left">Time</TableCell>
							</TableRow>
						</TableHead>
						<TableBody></TableBody>
					</Table>
				</TableContainer>
			);
			setConnected(true);
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
				message: message.toString(),
				time: Date().replace("GMT-0400 (Atlantic Standard Time)", ""),
			});
			console.log(rows);
			setTable(
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 250 }} aria-label="log table">
						<TableHead>
							<TableRow>
								<TableCell>id</TableCell>
								<TableCell align="left">Message</TableCell>
								<TableCell align="left">Time</TableCell>
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
									<TableCell align="left">{row.message}</TableCell>
									<TableCell align="left">{row.time}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			);
		});

		return handleDisconnect;
	}, [client]);

	// Notifications
	const [connected, setConnected] = useState(false);
	const connected_notification = (
		<Snackbar
			open={connected}
			autoHideDuration={3000}
			onClose={() => setConnected(false)}
		>
			<MuiAlert
				onClose={() => setConnected(false)}
				severity="success"
				sx={{ width: "100%" }}
			>
				Connection successful!
			</MuiAlert>
		</Snackbar>
	);

	const [disconnected, setDisconnected] = useState(false);
	const disconnected_notification = (
		<Snackbar
			open={disconnected}
			autoHideDuration={3000}
			onClose={() => setDisconnected(false)}
		>
			<MuiAlert
				onClose={() => setDisconnected(false)}
				severity="error"
				sx={{ width: "100%" }}
			>
				Client disconnected.
			</MuiAlert>
		</Snackbar>
	);

	return (
		<Box component="main" sx={{ flexGrow: 0, ml: 10, mt: 5 }}>
			<DrawerHeader />
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
			{connected_notification}
			{disconnected_notification}
		</Box>
	);
}
