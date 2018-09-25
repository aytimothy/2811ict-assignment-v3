// Required libraries and modules.
const body_parser = require('body-parser');
const cors = require('cors');
const express = require('express');
const http = require('http');
const mongodb = require('mongodb');
const socketio = require('socket.io');

// Settings
const settings = {
    port: 3000,                     // The port for the NodeJS server to listen on.
    db_addr: 'localhost',           // The address of the MongoDB server.
    db_port: 27017,                 // The port of the MongoDB server.
    db_name: '2811ict-chatapp'      // The name of the MongoDB database located on the server to use.
};

// Instances
const app = express();
const server = http.Server(app);

app.use(body_parser.json());
app.use(body_parser.urlencoded());
// Add headers
app.use(function (req, res, next) {     // https://stackoverflow.com/a/18311469/3505377
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

const io = socketio(server);
const mongo_client = mongodb.MongoClient;

// Setup
const httpServer = server.listen(settings.port, function () {
    let address = httpServer.address().address;
    const port = httpServer.address().port;
    if (address === "::") {
        address = "localhost/127.0.0.1";
    }
    console.log("Server listening on: " + address + ":" + port);
});

mongo_client.connect('mongodb://' + settings.db_addr + ':' + settings.db_port + '/' + settings.db_name, (err, db) => {
    if (err) {
        console.log('Could not connect to the MongoDB database.');
        console.log(err);
        server.close();
        return;
    }

    const dbo = db.db('2811ict-chatapp');

    console.log('Successfully connected to: mongodb://' + settings.db_addr + ':' + settings.db_port + '/' + settings.db_name);
    require('./routes.js')(express, app, dbo);
    require('./sockets.js')(io, dbo);
});