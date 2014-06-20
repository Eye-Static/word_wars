'use strict';
var Board  = require('./Board');
var Bag    = require('./Bag');
var Tray   = require('./Tray');
var Player = require('./Player');

$(document).ready(function ()
{
  var board;
  // var board = new Board();
  // board.render();
  //
  // the only reason to make a new board here is to use it as a
  // background image on the start screen. The board used for the
  // game is in newGame()

  var bag = new Bag();
  var player1 = new Player();

  newGame();

  //////////////////////////////////////////////////

  function newGame ()
  {
    board = new Board('diamond');    // create the board in data
    board.render();      // draw the board to html
    bag.fill();          // add letters to bag
    bag.shake();         // randomize bag
    player1.startTurn (bag);
  }
});
