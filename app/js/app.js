'use strict';
var Board = require('./Board');

$(document).ready(function ()
{
  var board = new Board();
  console.dir(board);
  board.generate();
});
