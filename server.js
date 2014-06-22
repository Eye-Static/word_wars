'use strict';
var express = require('express');
var http    = require('http');
var app     = express();

var server  = http.createServer(app);
var io      = require('socket.io')(server);

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/dist'));

// server.listen(app.get('port'), function () {  //what is this actually used for?
//   console.log('Server start on: ' + app.get('port'));
// });

io.on('connection', function(socket){
  console.log('connection made');

  socket.emit('message', {message:'hello'});
  socket.on('error',function(data){
    console.dir(data);
  });
  socket.on('disconnect',function(){
    console.log('someone disconnected');
  });
});
