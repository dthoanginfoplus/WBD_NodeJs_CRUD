var express = require('express');
var mysql = require('mysql');
var app = express();
const bodyParser = require('body-parser');
const port = 3000;
var CORS = require('cors');
// var user = require('../WBD_NodeJs_CRUD/routes/userRoute');
var user = require('../crudd/routes/userRoute');

// parse application/json
app.use(bodyParser.json());

app.use(CORS());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', user);



app.listen(port, function () {
	console.log('Server running at port', port);
});