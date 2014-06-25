'use strict';
var express = require('express');
var http    = require('http');
var app     = express();

var server  = http.createServer(app);
var io      = require('socket.io')(server);

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/dist'));

server.listen(app.get('port'), function () {  //what is this actually used for?
  console.log('Server start on: ' + app.get('port'));
});

var users = {};
//user list with name as key and follow values
//userName (same as key), gameStatus, loggedIn
var games = [];
var gameCounter = 1000;

io.on('connection', function(socket)
{
  console.log('user connected');
  socket.emit('message', {message:'connected to server'});

  if(games.length>0)
  {
    games.forEach(function(game)
    {
      console.log('sending game:');
      console.log(game);
      socket.emit('gameAppeared', game);
    });
  }

  socket.on('submitName', function(data)
  {
    console.log(data.userName + ' logged in');
    socket.user = data.userName; //socket just has user name
    users[data.userName] = data;
    console.dir(users);
  });

  socket.on('startGameRequest', function(data)
  {
    console.log('game request data', data);
    data.gameID = gameCounter++;
    games.push(data);
    socket.broadcast.emit('gameAppeared', data);
  });

  socket.on('disconnect', function()
  {
    console.log((socket.user || 'anon') + ' disconnected');
    if(users[socket.user])
    {
      users[socket.user].loggedIn = false;
    }
    console.log('users in database are: ');
    console.dir(users);
  });

  socket.on('error', function(err){ console.dir(err); });
});
