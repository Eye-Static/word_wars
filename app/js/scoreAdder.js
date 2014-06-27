var Board     = require ('./Board');
var validator = require ('./validator');

var game;
var scoreAdder = {};

//////////////////////////////////////////////////

scoreAdder.test = function ()
{
};

// returns the score of the new letters placed this turn
scoreAdder.wordScore = function (gameRef)
{
  game = gameRef;

  // get an array of all the new letter coordinates
  var newletters = validator.getNewLetters();
  var score = 0;
  var y, x, l;
  var letterMultiplyer
  var wordMultiplyer = 1;
  var wordPoints = 0;

  for (l = 0; l < newletters.length; l += 1)
  {
    y = newletters[l][0];
    x = newletters[l][1];
    letterMultiplyer = 1;

         if (game.board.grid[y][x].bonus === 'DL') letterMultiplyer = 2;
    else if (game.board.grid[y][x].bonus === 'TL') letterMultiplyer = 3;
    else if (game.board.grid[y][x].bonus === 'DW') wordMultiplyer += 1;
    else if (game.board.grid[y][x].bonus === 'TW') wordMultiplyer += 2;

    wordPoints += (game.board.grid[y][x].letter.score * letterMultiplyer);      // add the points
    game.board.grid[y][x].letter.justPlaced = false;  // clear the justPlaced flag
  }
  score += (wordPoints * wordMultiplyer);

  console.log('Score: ' + score);
  return score;
};
