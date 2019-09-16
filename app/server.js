const express = require('express');
var session = require('express-session');
const http = require('http');
const bodyParser = require('body-parser');
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// default to a 'localhost' configuration:
let connection_string = '127.0.0.1:27017/ecommerce';

// DB Setup
mongoose.connect('mongodb://'+ connection_string);

app.set('view engine', 'ejs');

app.use(session({
	secret: 'secret',
	resave: true,
	rolling: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/'));
app.use(cors());
app.use(bodyParser.json());

router(app);

// Server setup
const port = 4000;
const ip = '0.0.0.0';
const server = http.createServer(app);
server.listen(port, ip);
console.log("Listening on " + ip + ", port " + port );