'use strict';
var Board = require('./Board');
var Bag = require('./Bag');
var Tray = require('./Tray');
$(document).ready(function ()
{
  var board = new Board(); // grid layouts can be passed as strings
                           // like new Board('wordsWithFriends')
                           console.dir(board);
  var bag = new Bag();
  var tray1 = new Tray();

  board.render();    // draw the board to html
  console.log(board);

  bag.fill();
  bag.shake();
  tray1.refill (bag);
  tray1.render();
  console.log(tray1.letters.length);
  console.log(bag.letters.length);
});

