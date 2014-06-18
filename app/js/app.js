'use strict';
var Board = require('./Board');
var Bag = require('./Bag');

$(document).ready(function ()
{
  var board = new Board();
  var bag = new Bag();

  console.log(board);

  board.generate();  // create the board in data
  board.render();    // draw the board to html
  bag.fill();
});

