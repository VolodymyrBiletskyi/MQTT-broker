import aedesFactory from "aedes";
import net from "net";

const MQTT_PORT = 1883;

const aedes = aedesFactory();

const server = net.createServer(aedes.handle);

server.listen(MQTT_PORT, () => {
    console.log(`MQTT Broker running on TCP port ${MQTT_PORT}`);
});

aedes.authenticate = (client, username, password, done) => {
    console.log(`Allowing client ${client.id} without auth`);
    done(null, true);
};

aedes.on("client", (client) => {
    console.log(`Client connected: ${client?.id}`);
});

aedes.on("clientDisconnect", (client) => {
    console.log(`Client disconnected: ${client?.id}`);
});

aedes.on("publish", (packet, client) => {
    if (!packet.topic || packet.topic.startsWith("$SYS")) return;

    console.log(
        "Publish:",
        "topic =", packet.topic,
        "| from =", client?.id || "broker",
        "| payload =", packet.payload.toString()
    );
});
