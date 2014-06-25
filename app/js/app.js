'use strict';
var Game    = require('./Game');
var Connection = require('./Connection');

$(document).ready(function ()
{
  var userName;
  var game;
  game = new Game(); //this is just for testing, in the final version
                         //games are only started with the button
  var connection = new Connection();

  //////////////////////////////////////////////////

  $('#login-button').on('click', function ()
  {
    userName  = $('#user-name').val();
    $('#user-name').empty();
    $('#login-box').text('Logged in as ' + userName);
    connection.sendUserName(userName); //func from connect
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

  $('#game-lobby').on('click','.game-listing', function(e)
  {
    var gameID = $(this).context.id;
    connection.joinGame(gameID);//parse e
  });

  //////////////////////////////////////////////////

  $('#print-tray-button').click (function ()
  {
    for(var i = 0; i < game.players.length; i ++)
    {
      game.players[i].tray.print();
    }
  });

  //////////////////////////////////////////////////

  $('#shuffle-tray-button').click (function ()
  {
    game.players[0].tray.shuffle();
    game.players[0].tray.render();
    //game.board.render (game.players[game.turn]);
    game.board.addListeners (game.players);
  });

  //////////////////////////////////////////////////

  $('#print-grid-button').click (function ()
  {
    game.board.printGrid();
  });

  //////////////////////////////////////////////////

  $('#done-button').on('click', function()
  {
    game.finishTurn();
    game.nextTurn();
  })

});
