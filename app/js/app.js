'use strict';
var Game    = require('./Game');
var Connection = require('./Connection');

$(document).ready(function ()
{
  var userName;
  var game;
  game = new Game('scrabble', 2); //this is just for testing, in the final version
                         //games are only started with the button
  var connection = new Connection();

  //////////////////////////////////////////////////

  $('#login-button').on('click', function ()
  {
    userName  = $('#user-name').val();
    $('#user-name').empty();
    $('#login-box').text('Logged in as ' + userName);
    connection.sendUserName(userName); //func from Connection.js
  });

  //////////////////////////////////////////////////

  $('#new-game-button').on('click', function(event)
  {
    var boardType = $('#board-type').val();
    var gameData  = $('#game-type').val().split(' '); //such as 'local 2'
    var gameType  = gameData[0];
    var playerNum = Number.parseInt(gameData[1]);

    if(gameType === 'local')
    {
      game = new Game(boardType, playerNum);
    }
    else
    {
      //request for more player over internet
      connection.startGameRequest(boardType, playerNum, userName);
    }
  });

  //////////////////////////////////////////////////

  $('#game-lobby').on('click','.game-listing', function()
  {
    var gameID = $(this).context.id;
    connection.joinGame(gameID);
  });

  //////////////////////////////////////////////////

});
