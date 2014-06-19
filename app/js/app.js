'use strict';
var Board = require('./Board');
var Bag = require('./Bag');

$(document).ready(function ()
{
  var board = new Board(); // grid layouts can be passed as strings
                           // like new Board('wordsWithFriends')
                           console.dir(board);
  var bag = new Bag();

  board.render();    // draw the board to html
  console.log(board);

  bag.fill();
  bag.shake();
});

