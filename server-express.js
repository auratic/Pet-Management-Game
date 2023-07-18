
/*
var mysql = require('mysql');
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring')
var db = require('./db.js');

var express = require('express');
var session = require('express-session');
var path = require('path');

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.listen(8080);
*/