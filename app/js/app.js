'use strict';
var Board  = require('./Board');
var Bag    = require('./Bag');
var Player = require('./Player');

$(document).ready(function ()
{
  var board;
  var bag;
  var player = [];

  newGame();

  console.log(board);

  player[0].startTurn (bag);

  console.log(player[0].tray.letters.length);
  console.log(bag.letters.length);

  //////////////////////////////////////////////////

  function newGame ()
  {
    // grid layouts can be passed as strings like new Board('wordsWithFriends')
    board = new Board('wordsWithFriends');
    bag = new Bag();
    player[0] = new Player();
    player[1] = new Player();

    bag.fill();          // add letters to bag
    bag.shake();         // randomize bag
    board.render();      // draw the board to html
  }
});
