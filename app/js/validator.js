var dictionary = require('./dictionary');
var game;

var validator = {};

// check if the new word has valid placement (straight line and connected)
validator.isValid = function (gameRef)
{
  game = gameRef;
  // get an array of all the new letter coordinates
  var newletters = validator.getNewLetters(game);
  var orientation = validator.isLine (newletters, game);

  console.log ('Orientation: ' + orientation);

  if (orientation === null) return false;  // not a line
  else if (!validator.isConnected (newletters, orientation)) return false;  // has a break
  else return true;
};

//////////////////////////////////////////////////

// returns a 2D array of grid coordinates [y, x] for all new letters on the board
validator.getNewLetters = function ()
{
  var newletters = [];  // an array to hold pairs of coordinates of the new letters

  // run through the grid
  for (var y = 0; y < game.board.grid.length; y += 1)
  {
    for (var x = 0; x < game.board.grid[y].length; x += 1)
    {
      if (game.board.grid[y][x].letter && game.board.grid[y][x].letter.justPlaced === true)
      {
        newletters.push ([y, x]);
      }
    }
  }
  return newletters;
};

//////////////////////////////////////////////////

// take an array of grid coordinates for the new letters.
// check if the new word has any broken spaces, and return false if it does
validator.isConnected = function (newletters, orientation)
{
  var x, y;

  if (orientation === 'horizontal')
  {
    y = newletters[0][0];

    // check every square from the left-most to right-most for letters
    for (x = newletters[0][1]; x < newletters[newletters.length - 1][1]; x += 1)
    {
      if (game.board.grid[y][x].letter === null) return false;  // empty space
    }
  }
  else  // vertical
  {
    x = newletters[0][1];

    // check every square from the top-most to bottom-most for letters
    for (y = newletters[0][0]; y < newletters[newletters.length - 1][0]; y += 1)
    {
      if (game.board.grid[y][x].letter === null) return false;  // empty space
    }
  }
  return true;

  // var x1, y1, x2, y2;  // the first and last letters in the word

  // if (orientation === 'horizontal'
  // {
  //   x1 = newletters[0][1];
  //   y1 = newletters[0][0];
  //   x2 = newletters[newletters
  // }
};

//////////////////////////////////////////////////

// take an array of grid coordinates for the new letters.
// check if placed letters are in a straight line
// returns 'horizontal', 'vertical', or null
validator.isLine = function (newletters)
{
  // check x and y in the new array for straight lines
  var isHorizontal = true;
  var isVertical = true;
  for (var l = 1; l < newletters.length; l += 1)
  {
    if (newletters[l][0] != newletters[0][0])  // y coordinates do not match
    {
      isHorizontal = false;
    }
    if (newletters[l][1] != newletters[0][1])  // x coordinates do not match
    {
      isVertical = false;
    }
  }
  if (isHorizontal === true) return 'horizontal';
  else if (isVertical === true) return 'vertical';
  else return null;
};

//////////////////////////////////////////////////

validator.checkWords = function()
{
  //input goes in as an array
  dictionary.lookup(['tyler', 'is', 'a', 'mensch'], function(returnData){
    console.dir(returnData);
    //returnData comes out as an array of objects like the following:
    //{word : 'the word', definition: 'definition' (or null if word not found)}
    //returnData is in SAME order as input, woohoo!
  });
};

module.exports = validator;
