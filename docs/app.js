var client;

var BROKER = "broker.hivemq.com";
var PORT = Number(8000);
var CLIENT_ID = "bio-optics-pc";
var topic = "SSH/NCAS-M";

function connect() {
	$("#logger").empty();
	$("#logger").append("Host: " + BROKER + "</br>");
	$("#logger").append("Port:" + PORT + "</br>");
	$("#logger").append("Topic: " + topic + "</br>");

	// Create a client instance: Broker, Port, Websocket Path, Client ID
	client = new Paho.MQTT.Client(BROKER, PORT, CLIENT_ID);

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
		$("#logger").append("Connected and listening... </br>");
		client.subscribe(topic);
	}

	// Connect the client, providing an onConnect callback
	client.connect({
		onSuccess: onConnect,
		useSSL: true,
	});
}

async function publish() {
	for (var i = 0; i < 20; i++) {
		var value = Math.floor(Math.random() * (50 - 10) + 10).toString();

		// Publish a Message
		var message = new Paho.MQTT.Message(value);
		message.destinationName = topic;
		message.qos = 0;

		client.send(message);
	}
}
