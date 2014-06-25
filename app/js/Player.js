'use strict';
var Tray = require ('./Tray');

module.exports = function Player (board, playerNum)
{
  this.score = 0;
  this.playerNum = playerNum;
  this.tray = new Tray(board, playerNum);

  ////////////////////////////////////////

  this.refillTiles = function (bag)
  {
    this.tray.refill (bag);
    this.tray.render();
  };
};
