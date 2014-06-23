'use strict';
var Tray = require ('./Tray');

module.exports = function Player (board)
{
  this.score = 0;
  this.tray = new Tray(board);

  ////////////////////////////////////////

  this.startTurn = function (bag)
  {
    this.tray.refill (bag);
    this.tray.render();
  };
};
