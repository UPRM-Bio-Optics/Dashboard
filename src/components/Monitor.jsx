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
import { useState } from "react";

function createData(depth, time, from) {
	return { depth, time, from };
}

const rows = [
	createData("3", Date(), "bob"),
	createData("10", Date(), "bob"),
	createData("20", Date(), "bob"),
	createData("10", Date(), "bob"),
	createData("3", Date(), "bob"),
];

export default function Monitor() {
	// MQTT connection
	const [broker, setBroker] = useState("");
	const [port, setPort] = useState("");
	const [client, setClient] = useState("");
	const [topic, setTopic] = useState("");

	// data id
	var id = 0;

	const handleConnect = () => {
		console.log(
			"Connecting to: " + broker + " " + port + " " + client + " " + topic
		);
	};

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
						label="Client"
						variant="filled"
						value={client}
						onChange={(e) => setClient(e.target.value)}
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
				</Grid>
			</Grid>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>id</TableCell>
							<TableCell align="left">Depth</TableCell>
							<TableCell align="left">Time</TableCell>
							<TableCell align="left">From</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<TableRow
								key={id}
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									{id++}
								</TableCell>
								<TableCell align="left">{row.depth}</TableCell>
								<TableCell align="left">{row.time}</TableCell>
								<TableCell align="left">{row.from}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
