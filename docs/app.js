var client;

function connect() {
	// Create a client instance: Broker, Port, Websocket Path, Client ID
	client = new Paho.MQTT.Client(
		"broker.mqttdashboard.com",
		Number(8000),
		"clientId-bob"
	);

	// set callback handlers
	client.onConnectionLost = function (responseObject) {
		console.log("Connection Lost: " + responseObject.errorMessage);
	};

	client.onMessageArrived = function (message) {
		console.log("Message Arrived: " + message.payloadString);
		$("#logger").append(message.payloadString + " feet </br>");
	};

	// Called when the connection is made
	function onConnect() {
		console.log("Connected!");
		client.subscribe("/Echosounder");
	}

	// Connect the client, providing an onConnect callback
	client.connect({
		onSuccess: onConnect,
	});
}

async function publish() {
	$("#logger").empty();
	for (var i = 0; i < 20; i++) {
		var value = Math.floor(Math.random() * (50 - 10) + 10).toString();

		// Publish a Message
		var message = new Paho.MQTT.Message(value);
		message.destinationName = "/Echosounder";
		message.qos = 0;

		await setTimeout(client.send(message), 5000);
	}
}
