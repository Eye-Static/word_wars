'use strict';
var Game   = require('./Game');
require('./connect');

$(document).ready(function ()
{
  var game = new Game(); //this is just for testing, in the final version
                         //games are only started with the button

  //////////////////////////////////////////////////

  $('#new-game-button').on('click', function(event)
  {
    var boardType = $('#board-type').val();
    var playerNum = $('#player-number').val();
    game = new Game(boardType, playerNum);
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
  });
});
