var express = require('express');
var mysql = require('mysql');
var app = express();
const bodyParser = require('body-parser');
const port = 3000;
var user = require('../WBD_NodeJs_CRUD/routes/userRoute')

// parse application/json
app.use(bodyParser.json());

app.use('/user', user);



app.listen(port, function () {
	console.log('Server running at port', port);
});