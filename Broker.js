const aedes = require('aedes')();
const net = require('net');
const http = require('http');
const ws = require('websocket-stream');
const https = require("node:https");

const MQTT_Port = process.env.MQTT_PORT || 1883;
const WS_PORT = process.env.WS_PORT || 8083;

const tcpServer = net.createServer(aedes.handle);
tcpServer.listen(MQTT_Port, () => {
    console.log(`MQTT TCP BROKER ON PORT ${MQTT_Port}`);
});

const httpServer = http.createServer();
ws.createServer({server: httpServer},aedes.handle);
httpServer.listen(WS_PORT, () => {
    console.log(`MQTT WS BROKER ON PORT ${WS_PORT}`);
});

aedes.on('client', (client) => {
    console.log(`Client connected:`, client ? client.id : 'unknown');
});

aedes.on('clientDisconnect', (client) => {
    console.log('Client disconnected', client ? client.id :'unknown');
});

aedes.on('publish', (packet,client) => {
    if(packet.topic && !packet.topic.startsWith('$SYS')){
        console.log('publish',
            'topic = ', packet.topic,
            'payload = ', packet.payload.toString(),
            'from =', client ? client.id : 'broker'
        );
    }
});