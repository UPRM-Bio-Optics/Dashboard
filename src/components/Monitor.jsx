import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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
	return (
		<>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Depth (feet)</TableCell>
							<TableCell align="left">Time</TableCell>
							<TableCell align="left">From</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<TableRow
								key={row.depth}
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									{row.depth}
								</TableCell>
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
