'use strict';
var Game    = require('./Game');
var Connection = require('./Connection');

$(document).ready(function ()
{
  var userName;
  var game;
  game = new Game(); //this is just for testing, in the final version
                         //games are only started with the button
  var connection = new Connection();//move into login-button click?
  //for some reason having this here fixes the gameAppeared bug

  //////////////////////////////////////////////////

  $('#login-button').on('click', function ()
  {
    userName  = $('#user-name').val();
    $('#user-name').empty();
    $('#login-box').append('Logged in as ' + userName);
    connection.sendUserName(userName); //func from connect
  });

  //////////////////////////////////////////////////

  $('#new-game-button').on('click', function(event)
  {
    var boardType = $('#board-type').val();
    var playerNum = Number.parseInt($('#player-number').val());
    if(playerNum === 1)
    {
      game = new Game(boardType, playerNum);
    }
    connection.startGameRequest(boardType, playerNum, userName);
  });

  //////////////////////////////////////////////////

  $('#game-lobby').on('click','.game-listing', function(e)
  {
    var gameID = $(this).context.id;
    connection.joinGame(gameID);//parse e
  });

  //////////////////////////////////////////////////

  $('#print-tray-button').click (function ()
  {
    game.players[0].tray.print();
  });

  //////////////////////////////////////////////////

  $('#shuffle-tray-button').click (function ()
  {
    game.players[0].tray.shuffle();
    game.players[0].tray.render();
    game.board.render (game.players[game.turn]);
  });

  //////////////////////////////////////////////////

  $('#print-grid-button').click (function ()
  {
    game.board.printGrid();
  });
});
