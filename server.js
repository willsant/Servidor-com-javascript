const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const { Socket } = require("dgram");
const { EventEmitter } = require('events');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const messageEventEmitter = new EventEmitter();

messageEventEmitter.emit("message");

app.use(bodyParser.json());

app.get("/", (req, res) => { 
    res.send("Hello World"); 
});

app.get("/message", (req, res) => {

    var msg = JSON.stringify(req.body);

    console.log(msg);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN){
            console.log(msg);
            client.send(msg);
        }
    });
    
    res.send("ok");
})

app.post("/message", (req, res) => {
    var msg = JSON.stringify(req.body);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN){
            console.log(msg);
            client.send(msg);
        }
    });
    
    res.send("ok");
})

let users = [];

wss.addListener("connection", (event) => {
    users.push(event);
    //event.send(eve);
    console.log(users.length);
    event.on('message', (message) => {
        console.log(message.toString());
        //res.send
    });
    event.on("close", (ws) => {
        console.log(ws.id + " Desconectou");
        users.length --;
        console.log(users.length);
    })
})
server.listen(8080, () => console.log('Servidor rodando na 8080'));