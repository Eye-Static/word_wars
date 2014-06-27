var dictionary = require('./dictionary');
var game;

var validator = {};

// check if the new word has valid placement (straight line and connected)
validator.isValid = function (gameRef)
{
  game = gameRef;

  // get an array of all the new letter coordinates
  var newletters = this.getNewLetters();
  var orientation = this.isLine (newletters);
  var spelledWords = [];
  var gibberish, w;

  console.log ('Orientation: ' + orientation);

  // check for no letters being played (turn skip)
  if (newletters.length ===0) return true;

  // check for star
  else if (game.turn.turnNum ===1 && !this.onStar (newletters))
  {
    alert ('The first word must be placed on the STAR tile.');
    return false;
  }
  // check for lines
  else if (orientation ===null)
  {
    alert ('Words must be placed in a straight lines.');
    return false;
  }
  // check for breaks
  else if (!this.isConnected (newletters, orientation))
  {
    alert ('Words may not contain spaces.');
    return false;
  }
  // check for... touching?
  else if (game.turn.turnNum > 1 && !this.isTouching (newletters, orientation))
  {
    alert ('New words must touch an existing word.');
    return false;
  }

  spelledWords = this.spellWords(newletters, orientation);
  //this.checkWords(spelledWords);

  dictionary.results = [];
  dictionary.lookup (spelledWords, function (returnData)
  {
    //console.dir(returnData);
    //  dictionary.lookup(['tyler', 'is', 'a', 'mensch'], function(returnData){
    // console.dir(returnData);
    //returnData comes out as an array of objects like the following:
    //{word : 'the word', definition: 'definition' (or null if word not found)}
    //returnData is in SAME order as input, woohoo!

    gibberish = false;

    for (var w = 0; w < returnData.length; w += 1)
    {
      if (returnData[w].definition === null)
      {
        alert (returnData[w].word + ' is not a word.');
        gibberish = true;
      }
    }
    if (gibberish === false)
    {
      $('#spelled-word').empty();
      for (w = 0; w < returnData.length; w += 1)
      {
        $('#spelled-word').append('<span>'+returnData[w].word.toUpperCase() + ' - ' + returnData[w].definition+'</span>');
      }
      $('#spelled-word').fadeIn('slow');
      $('body').on('click', function()
      {
        $('#spelled-word').fadeOut('slow');
        $('body').off();
        game.finishTurn();
        game.nextTurn();
      });
    }
  });
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
// check if one of the letters is on the star.
// return true/false.
validator.onStar = function (newletters)
{
  var x, y;

  for (var l = 0; l < newletters.length; l += 1)
  {
    y = newletters[l][0];
    x = newletters[l][1];

    if (game.board.grid[y][x].bonus ==='*') return true;
  }
  return false;
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
    if (newletters[l][0] !== newletters[0][0])  // y coordinates do not match
    {
      isHorizontal = false;
    }
    if (newletters[l][1] !== newletters[0][1])  // x coordinates do not match
    {
      isVertical = false;
    }
  }
  if (isHorizontal === true) return 'horizontal';
  else if (isVertical === true) return 'vertical';
  else return null;
};

//////////////////////////////////////////////////

// take an array of grid coordinates for the new letters.
// check to make sure at least one new letter is touching an old letter.
// returns true/false.
validator.isTouching = function (newletters)
{
  var y, x, l;

  for (l = 0; l < newletters.length; l += 1)
  {
    y = newletters[l][0];
    x = newletters[l][1];

    if (x > 0 && game.board.grid[y][x - 1].letter !== null
        && game.board.grid[y][x - 1].letter.justPlaced ===false) return true;

    else if (x < game.board.maxX - 1 && game.board.grid[y][x + 1].letter !== null
        && game.board.grid[y][x + 1].letter.justPlaced ===false) return true;

    else if (y > 0 && game.board.grid[y - 1][x].letter !== null
        && game.board.grid[y - 1][x].letter.justPlaced ===false) return true;

    else if (y < 0 && game.board.grid[y + 1][x].letter !== null
        && game.board.grid[y + 1][x].letter.justPlaced ===false) return true;
  }
  return false;
};

//////////////////////////////////////////////////

// take an array of grid coordinates for the new letters, and the h/v orientation.
// create a string for each new word spelled and return them in an array.
validator.spellWords = function (newletters, orientation)
{
  var x, y;
  var word = '';
  var wordArray = [];
  var l;

  if (orientation === 'horizontal')
  {
    wordArray.push (this.findWordHorizontal (newletters[0]));

    for (l = 0; l < newletters.length; l += 1)
    {
      word = this.findWordVertical (newletters[l]);
      if (word.length > 1) wordArray.push (word);
    }
  }

  else  // vertical
  {
    wordArray.push (this.findWordVertical (newletters[0]));

    for (l = 0; l < newletters.length; l += 1)
    {
      word = this.findWordHorizontal (newletters[l]);
      if (word.length > 1) wordArray.push (word);
    }
  }

  console.log ("You spelled: " + word);
  return wordArray;
};

//////////////////////////////////////////////////

// find the entire horizontal word from a single grid location.
// return a string.
validator.findWordHorizontal = function (gridyx)
{
  var word = '';
  var firstLetter = this.findFirstHorizontal (gridyx);
  var lastLetter =  this.findLastHorizontal  (gridyx);
  var y = firstLetter[0];

  for (var x = firstLetter[1]; x <= lastLetter[1]; x += 1)
   {
   word = word.concat(game.board.grid[y][x].letter.character);
   }
  return word.toLowerCase();
};

//////////////////////////////////////////////////

// find the entire vertical word from a single grid location.
// return a string.
validator.findWordVertical = function (gridyx)
{
  var word = '';
  var firstLetter = this.findFirstVertical (gridyx);
  var lastLetter =  this.findLastVertical  (gridyx);
  var x = firstLetter[1];

  for (var y = firstLetter[0]; y <= lastLetter[0]; y += 1)
   {
   word = word.concat(game.board.grid[y][x].letter.character);
   }
  return word.toLowerCase();
};

//////////////////////////////////////////////////

// take an array of one [y, x] letter position.
// find the first letter of a word that was spelled horizontally.
// return the [y, x] coordinates in an array.
validator.findFirstHorizontal = function (gridyx)
{
  var x = gridyx[1];
  var y = gridyx[0];

  while (x > 0 && game.board.grid[y][x].letter !== null)
  {
    x --;
  }
  return [y, x + 1];
};

//////////////////////////////////////////////////

// take an array of one [y, x] letter position.
// find the last letter of a word that was spelled horizontally.
// return the [y, x] coordinates in an array.
validator.findLastHorizontal = function (gridyx)
{
  var x = gridyx[1];
  var y = gridyx[0];

  while (x < game.board.maxX && game.board.grid[y][x].letter !== null)
  {
    x ++;
  }
  return [y, x - 1];
};

//////////////////////////////////////////////////

// take an array of one [y, x] letter position.
// find the first letter of a word that was spelled vertically.
// return the [y, x] coordinates in an array.
validator.findFirstVertical = function (gridyx)
{
  var x = gridyx[1];
  var y = gridyx[0];

  while (y > 0 && game.board.grid[y][x].letter !== null)
  {
    y --;
  }
  return [y + 1, x];
};

//////////////////////////////////////////////////

// take an array of one [y, x] letter position.
// find the last letter of a word that was spelled vertically.
// return the [y, x] coordinates in an array.
validator.findLastVertical = function (gridyx)
{
  var x = gridyx[1];
  var y = gridyx[0];

  while (y < game.board.maxY && game.board.grid[y][x].letter !== null)
  {
    y ++;
  }
  return [y - 1, x];
};

module.exports = validator;
