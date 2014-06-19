'use strict';
var Letter = require('./Letter');

module.exports = function Tray ()
{
  this.letters = [];  // array of letter objects (max 7)
  
  //////////////////////////////////////////////////

  // remove letters from the bag and add them to the tray
  // until the tray has 7.
  this.refill = function ()
  {
  };

  //////////////////////////////////////////////////

  // add one specific letter to the tray
  this.add = function (letter)
  {
  };

  //////////////////////////////////////////////////

  // remove one specific letter from the tray
  this.remove = function (letter)
  {
  };
};
