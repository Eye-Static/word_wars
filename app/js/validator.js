var dictionary = require('./dictionary');
var game;
var grid;
var validator = {};
var firstWordPlayed = false;

// check if the new word has valid placement (straight line and connected)
// add something to errorMessage to create popup and stop turn progression
validator.isValid = function (gameRef)
{
  game = gameRef;
  grid = game.board.grid; //just a shortcut

  // get an array of all the new letter coordinates
  var newletters = this.getNewLetters();
  var wordsData = []; //the words made in the turn
  var spelledWords = [];
  var firstLetters = [];
  var errorMessage = '';

  var errorDialog = function()
  {
    $('#bad-move-dialogue').empty();
    $('#bad-move-dialogue').append(errorMessage);
    $('#overlay').fadeIn('slow');
    $('.popup').hide();    //make sure unwanted dialogs are hidden
    $('#bad-move-dialogue').show();
    setTimeout(function()
    {
      $('body').on('click', function()  //async
      {
        console.log('in click');
        $('#overlay').fadeOut('slow');
        //$('#bad-move-dialogue').fadeOut('slow');
        $('body').off('click');
      });
    }, 300);
  };

  if(newletters.length > 0 ) //player didn't pass
  {
    var orientation  = this.isLine (newletters);
    console.log ('Orientation: ' + orientation);

    firstLetters = this.getFirstLetters (newletters, orientation);

    // check for star
    if (!firstWordPlayed && !this.onStar (newletters) )
    {
      errorMessage = 'The first word must be placed on the STAR tile.';
    }
    // check for lines
    else if (orientation === null)
    {
      errorMessage = 'Words must be placed in a straight line.';
    }
    // check for breaks
    else if (!this.isConnected (newletters, orientation))
    {
      errorMessage = 'Words may not contain spaces.';
    }
    // check for... touching?
    else if (firstWordPlayed && !this.isTouching (newletters, orientation))
    {
      errorMessage = 'New words must touch an existing word.';
    }
    spelledWords = this.spellWords(newletters, orientation);
  }

  if(errorMessage)
  {
    errorDialog();
  }
  else
  {
    dictionary.results = []; //reset results, currently not done in dictionary, whoops
    dictionary.lookup (spelledWords, function (returnData)
    {
      //returnData comes out as an array of objects like the following:
      //{word : 'the word', definition: 'definition' (or null if word not found)}

      for (var w = 0; w < returnData.length; w += 1)
      {
        if (returnData[w].definition === null)
        {
          errorMessage = returnData[w].word.toUpperCase() + ' is not a word.';
        }
      }

      if(errorMessage)
      {
        errorDialog();
      }
      else
      {
        if(spelledWords.length > 0) {firstWordPlayed = true;} // at least one word has now been played
        game.turnTransition(returnData); //return words, or [] for a pass turn
      }
    });
  }
};

///////////////////////////////////////////////////
// returns a 2D array of grid coordinates [y, x] for all new letters on the board
validator.getNewLetters = function ()
{
  var newletters = [];  // an array to hold pairs of coordinates of the new letters

  // run through the grid
  for (var y = 0; y < grid.length; y += 1)
  {
    for (var x = 0; x < grid[y].length; x += 1)
    {
      if (grid[y][x].letter && grid[y][x].letter.justPlaced === true)
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

    if (grid[y][x].bonus === '*') return true;
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
      if (grid[y][x].letter === null) return false;  // empty space
    }
  }
  else  // vertical
  {
    x = newletters[0][1];

    // check every square from the top-most to bottom-most for letters
    for (y = newletters[0][0]; y < newletters[newletters.length - 1][0]; y += 1)
    {
      if (grid[y][x].letter === null) return false;  // empty space
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
  var isVertical   = true;
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
  if    (isHorizontal === true) return 'horizontal';
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

    if      ( x > 0 &&
      grid[y][x - 1].letter !== null &&
      grid[y][x - 1].letter.justPlaced === false) return true;

      else if ( x < game.board.maxX - 1 &&
        grid[y][x + 1].letter !== null &&
        grid[y][x + 1].letter.justPlaced === false) return true;

        else if ( y > 0 &&
          grid[y - 1][x].letter !== null &&
          grid[y - 1][x].letter.justPlaced === false) return true;

          else if ( y < game.board.maxY &&
            grid[y + 1][x].letter !== null &&
            grid[y + 1][x].letter.justPlaced === false) return true;
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
      console.log(word + ' is length ' + word.length);
      if (word.length > 1) {wordArray.push (word);}
    }
  }

  else if (orientation === 'vertical')
  {
    wordArray.push (this.findWordVertical (newletters[0]));

    for (l = 0; l < newletters.length; l += 1)
    {
      word = this.findWordHorizontal (newletters[l]);
      console.log(word + ' is length ' + word.length);
      if (word.length > 1) {wordArray.push (word);}
    }
  }

  console.log ('You spelled: ' + word);
  return wordArray;
};

//////////////////////////////////////////////////

// find the entire horizontal word from a single grid location.
// return a string.
validator.findWordHorizontal = function (gridyx)
{
  var word = '';
  var firstLetter = this.findFirstHorizontal (gridyx);
  var lastLetter  = this.findLastHorizontal  (gridyx);
  var y = firstLetter[0];

  for (var x = firstLetter[1]; x <= lastLetter[1]; x += 1)
  {
    word += grid[y][x].letter.character;
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
  var lastLetter  = this.findLastVertical  (gridyx);
  var x = firstLetter[1];

  for (var y = firstLetter[0]; y <= lastLetter[0]; y += 1)
  {
    word += grid[y][x].letter.character;
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

  while (x > 0 && grid[y][x].letter !== null)
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

  while (x < game.board.maxX && grid[y][x].letter !== null)
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

  while (y > 0 && grid[y][x].letter !== null)
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

  while (y < game.board.maxY && grid[y][x].letter !== null)
  {
    y ++;
  }
  return [y - 1, x];
};

//////////////////////////////////////////////////

validator.getFirstLetters = function (newletters, orientation)
{
  var firstLetters = [];
  var l;

  if (orientation === 'vertical')
  {
    firstLetters.push (this.findFirstHorizontal (newletters[0]));

    for (l = 0; l < newletters.length; l += 1)
    {
      if (this.findWordVertical (newletters[l]).length > 1)
      {
        firstLetters.push (this.findFirstVertical (newletters[l]));
      }
    }
  }
  else  // vertical
  {
    firstLetters.push (this.findFirstVertical (newletters[0]));

    for (l = 0; l < newletters.length; l += 1)
    {
      if (this.findWordHorizontal (newletters[l]).length > 1)
      {
        firstLetters.push (this.findFirstHorizontal (newletters[l]));
      }
    }
  }
  return firstLetters;
};

module.exports = validator;
