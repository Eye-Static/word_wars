'use strict';
var Board = require('./Board');
var Bag = require('./Bag');
var Tray = require('./Tray');
$(document).ready(function ()
{
  var board = new Board();
  var bag = new Bag();
  var tray1 = new Tray();

  console.log(board);

  board.generate();  // create the board in data
  board.render();    // draw the board to html
  bag.fill();
  bag.shake();
  tray1.refill (bag);
  tray1.render();
  console.log(tray1.letters.length);
  console.log(bag.letters.length);
});

