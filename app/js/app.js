'use strict';
var Board  = require('./Board');
var Bag    = require('./Bag');
var Tray   = require('./Tray');
var Player = require('./Player');

$(document).ready(function ()
{
  var board = new Board();
  var bag = new Bag();
  var player1 = new Player();

  console.log(board);

  newGame();

  player1.startTurn (bag);

  console.log(player1.tray.letters.length);
  console.log(bag.letters.length);

  //////////////////////////////////////////////////

  function newGame ()
  {
    board.generate();    // create the board in data
    board.render();      // draw the board to html
    bag.fill();          // add letters to bag
    bag.shake();         // randomize bag
  }
});
