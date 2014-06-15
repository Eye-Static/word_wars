'use strict';
var express = require('express');
var http    = require('http');

var app = express();

app.use(express.static(__dirname + '/dist'));
app.set('port', process.env.PORT || 3000);

var server = http.createServer(app);

server.listen(app.get('port'), function () {
  console.log('Server start on:' + app.get('port'));
});
