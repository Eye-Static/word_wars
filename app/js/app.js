'use strict';
var Board  = require('./Board');
var Bag    = require('./Bag');
var Player = require('./Player');

$(document).ready(function ()
{
  var board;
  var bag;
  var player = [];
  var turn = 0;

  newGame();

  board.render(player[turn]);  // draw the board
  player[turn].startTurn (bag);

  console.log(board);

  console.log(player[0].tray.letters.length);
  console.log(bag.letters.length);

  //////////////////////////////////////////////////

  function newGame ()
  {
    // grid layouts can be passed as strings like new Board('wordsWithFriends')
    board = new Board('diamond');
    bag = new Bag();
    player[0] = new Player();
    player[1] = new Player();

    bag.fill();               // add letters to bag
    bag.shake();              // randomize bag
  }

  //////////////////////////////////////////////////

  $('#newButton').click (function ()
  {
    newGame();
  });

  //////////////////////////////////////////////////

  $('#printTrayButton').click (function ()
  {
    player[0].tray.print();
  });

  //////////////////////////////////////////////////

  $('#shuffleTrayButton').click (function ()
  {
    player[0].tray.shuffle();
    player[0].tray.render();
  });
});
