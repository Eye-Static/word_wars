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

  // Randomize the bag's letter array.
  // I'm running through each letter in the array
  // and swapping it with another, chosen at random.
  this.shake = function ()
  {
    var temp;  // for storing a letter to do the swap
    var y;     // the random letter

    for (var x = 0; x < this.letters.length; x += 1)
    {
      temp = this.letters[x];
      y = Math.floor (Math.random() * this.letters.length);
      this.letters[x] = this.letters[y];
      this.letters[y] = temp;
    }
  };

  //////////////////////////////////////////////////

  // remove/pop the last letter object off the array and return it
  this.removeNext ()
  {
    return this.letters.pop();
  };
};
