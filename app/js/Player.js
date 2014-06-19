'use strict';
var Tray = require ('./Tray');

module.exports = function Player ()
{
  this.score = 0;
  this.tray = new Tray();

  ////////////////////////////////////////

  this.startTurn = function (bag)
  {
    this.tray.refill (bag);
    this.tray.render();
  };
};
