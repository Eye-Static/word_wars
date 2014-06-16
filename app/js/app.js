'use strict';
var $     = require('jquery');
var Board = require('./Board');

$(document).ready(function ()
{
  var board = new Board();
  console.log(board);
  board.generate();
});
