import paho.mqtt.client as mqtt
import os

# Connection details

host = "broker.hivemq.com"
port = 1883
protocol = "tcp"
topic = "bio-optics/bob"
id = "bob"

# The callback for when the client receives a CONNACK response from the server.


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe(topic)
    client.publish(topic, id+" connected!")

# The callback for when a PUBLISH message is received from the server


def on_message(client, userdata, msg):
    print(msg.payload.decode())
    if (msg.payload.decode() == "Testing 123!"):
        client.disconnect()
        # os._exit(os.X_OK)

if __name__ == '__main__':
    client = mqtt.Client(client_id=id, clean_session=True,
                        userdata=None, transport=protocol)

    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(host, port, 60)

    # Blocking call that processes network traffic, dispatches callbacks and
    # handles reconnecting.
    # Other loop*() functions are available that give a threaded interface and a
    # manual interface.
    client.loop_forever()
    # client.loop_start()

    # while (True):
    #     continue
    
