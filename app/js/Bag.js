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
    //Array of Letters in bag [Letter, Value, Quantity]
  	var data = [['A', 1, 9],
  	            ['B', 3, 2],
  	            ['C', 3, 3],
  	            ['D', 2, 4],
                ['E', 1, 12],
                ['F', 4, 2],
                ['G', 3, 2],
                ['H', 4, 2],
                ['I', 1, 9],
                ['J', 8, 1],
                ['K', 5, 1],
                ['L', 1, 4],
                ['M', 3, 2],
                ['N', 1, 6],
                ['O', 1, 8],
                ['P', 3, 2],
                ['Q', 10, 1],
                ['R', 1, 6],
                ['S', 1, 4],
                ['T', 1, 6],
                ['U', 1, 4],
                ['V', 4, 2],
                ['W', 4, 2],
                ['X', 8, 1],
                ['Y', 4, 2],
                ['Z', 10, 1],
                [ '', 0, 2]
               ];
    var j, i;
    var idCounter = 0;

  	for (j = 0; j<data.length; j++)
    {
  		for(i=0; i<data[j][2]; i++)
      {
			  this.letters.push (new Letter (data[j][0], data[j][1], 'id' + idCounter));
        idCounter += 1;
  		}
  	}
    console.log(this.letters.length);
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
  this.removeNext = function()
  {
    return this.letters.pop();
  };

  this.printAll = function()
  {
    for (var i = 0; i < this.letters.length; i ++)
    {
      console.log(this.letters[i].character);
    }
  };

};
