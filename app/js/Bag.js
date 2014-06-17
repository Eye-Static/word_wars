'use strict';
var Letter = require('./Letter');

module.exports = function Bag()
{
  this.letters = [];  // array of letter objects

  //////////////////////////////////////////////////

  // add a set number of each letter to the bag.
  // we can start with the official scrabble amounts Eric
  // posted and change later.
  this.fill = function ()
  {
  };

  //////////////////////////////////////////////////

  // randomize the bag's letter array
  this.shuffle = function ()
  {
  };

  //////////////////////////////////////////////////

  // remove/pop the last letter object off the array and return it
  this.removeNext ()
  {
  };
};
