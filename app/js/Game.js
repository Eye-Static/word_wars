'use strict';
var Board  = require('./Board');
var Bag    = require('./Bag');
var Player = require('./Player');
var GameButtons = require('./gameButtons');
var validator   = require ('./validator');
//var scoreAdder  = require ('./scoreAdder');

var Game = function (boardType, numOfPlayers)
{
  console.log('starting new game with board type: ' + (boardType || 'not set'));
  console.log('and players: ' + (numOfPlayers || 'not set'));

  new GameButtons(this);
  this.board = new Board(boardType);
  this.bag   = new Bag();
  this.turn  = {turnNum: 1, message: ''};
  this.players = [];
  this.whoseTurn = 0; // refers to which player in players array
                      // so 0 means the first player
  this.recentScore = 0;
  this.bag.fill();               // add letters to bag
  this.bag.shake();              // randomize bag

  for (var i = 0; i < (numOfPlayers || 1); i++)
  {
    this.players[i] = new Player(this.board, i);//pass board & the player number
    this.players[i].refillTiles (this.bag);
  }
  this.postNumTiles();
  this.board.render(); // tray is passed for binding reasons
  this.board.addListeners(this.players); //now this must be called manually
  this.start();
};

Game.prototype.start = function()
{
  this.clearGameArea();
  this.printGameStatus();
  this.players[0].tray.showTray();
  this.renderScore();
  this.board.printBonus();
};

Game.prototype.finishTurn = function ()
{
  var justFinishedPlayer = this.players[this.whoseTurn];

  //var recentScore = scoreAdder.test;//scoreAdder.wordScore (this);
  console.log('enter word score');
  this.recentScore = this.wordScore();
  justFinishedPlayer.score += this.recentScore;
  this.renderScore(this.recentScore);

  justFinishedPlayer.refillTiles(this.bag);
  this.postNumTiles();
  justFinishedPlayer.tray.render();
  this.board.render(this.players);
  this.board.addListeners(this.players);
};

Game.prototype.nextTurn = function()
{
  this.turn.turnNum ++;
  this.players[this.whoseTurn].tray.hideTray();
  // set whoseTurn to the next player
  this.whoseTurn = this.players[this.whoseTurn +1] ? this.whoseTurn + 1 : 0;
  this.players[this.whoseTurn].tray.showTray();
  this.printGameStatus();
};

Game.prototype.turnTransition = function(wordsData)
{
  var gameRef = this;
  this.finishTurn(); //sets recent score
  $('#spelled-word').empty();
  if(wordsData === null )
  {
    $('#spelled-word').append('<div>Player ' + (this.whoseTurn+1) + ' passed</div>');
  }
  else
  {
    $('#spelled-word').append('<div>Player ' + (this.whoseTurn+1) +
                            ' got ' + this.recentScore +
                            ' points for playing:</div><br>');
    for (var w = 0; w < wordsData.length; w ++)
    {
      $('#spelled-word').append('<div>'+wordsData[w].word.toUpperCase() + ' - ' + wordsData[w].definition+'</div>');
    }
  }

  $('#spelled-word').fadeIn('slow');
  $('html').on('click', function()
  {
    $('#spelled-word').fadeOut('slow');
    $('html').off('click');
    gameRef.nextTurn();
  });
};

Game.prototype.printGameStatus = function ()
{
  //change what this is connected to on the DOM
  $('#game-info').text('player ' + (this.whoseTurn+1) +
  '\'s turn. Turn: ' + (this.turn.message || this.turn.turnNum));
};

//////////////////////////////////////////////////

// returns the score of the new letters placed this turn
Game.prototype.wordScore = function()
{
  // get an array of all the new letter coordinates
  var newletters = validator.getNewLetters();
  if(newletters.length === 0){return 0;}
  var score = 0, wordScore = 0;
  var y, x, l;
  var letterMultiplyer;
  var wordMultiplyer = 1;
  var wordPoints = 0;
  var firstLetter, lastLetter;

  var orientation = validator.isLine (newletters);

  if (orientation === 'horizontal')
  {
    score += this.scoreWordHorizontal (newletters[0]);

    if (validator.findWordVertical (newletters[0]).length > 1)
    {
      score += this.scoreWordVertical (newletters[0]);
    }
  }

  else if (orientation === 'vertical')
  {
    score += this.scoreWordVertical (newletters[0]);
  }

  //score += (wordPoints * wordMultiplyer);

  for (l = 0; l < newletters.length; l += 1)
  {
     y = newletters[l][0];
     x = newletters[l][1];
     this.board.grid[y][x].letter.justPlaced = false;  // clear the justPlaced flag
   }

  console.log('Score: ' + score);
  return score;
};

//////////////////////////////////////////////////

Game.prototype.scoreWordHorizontal = function (gridyx)
{
  var y, x;
  var letterMultiplyer;
  var wordMultiplyer = 1;
  var wordPoints = 0;

  var firstLetter = validator.findFirstHorizontal (gridyx);
  var lastLetter  = validator.findLastHorizontal  (gridyx);

  y = firstLetter[0];
  for (x = firstLetter[1]; x <= lastLetter[1]; x += 1)
  {
    letterMultiplyer = 1;

    if (this.board.grid[y][x].letter.justPlaced === true)
    {
           if (this.board.grid[y][x].bonus === 'DL') letterMultiplyer = 2;
      else if (this.board.grid[y][x].bonus === 'TL') letterMultiplyer = 3;
      else if (this.board.grid[y][x].bonus === 'DW') wordMultiplyer += 1;
      else if (this.board.grid[y][x].bonus === '*')  wordMultiplyer += 1;
      else if (this.board.grid[y][x].bonus === 'TW') wordMultiplyer += 2;
    }

    wordPoints += (this.board.grid[y][x].letter.score * letterMultiplyer);      // add the points
  }
  return wordPoints * wordMultiplyer;
};

//////////////////////////////////////////////////

Game.prototype.scoreWordVertical = function (gridyx)
{
  var y, x;
  var letterMultiplyer;
  var wordMultiplyer = 1;
  var wordPoints = 0;

  var firstLetter = validator.findFirstVertical (gridyx);
  var lastLetter  = validator.findLastVertical  (gridyx);

  x = firstLetter[1];
  for (y = firstLetter[0]; y <= lastLetter[0]; y += 1)
  {
    letterMultiplyer = 1;

    if (this.board.grid[y][x].letter.justPlaced === true)
    {
           if (this.board.grid[y][x].bonus === 'DL') letterMultiplyer = 2;
      else if (this.board.grid[y][x].bonus === 'TL') letterMultiplyer = 3;
      else if (this.board.grid[y][x].bonus === 'DW') wordMultiplyer *= 2;
      else if (this.board.grid[y][x].bonus === '*')  wordMultiplyer *= 2;
      else if (this.board.grid[y][x].bonus === 'TW') wordMultiplyer *= 3;
    }

    wordPoints += (this.board.grid[y][x].letter.score * letterMultiplyer);      // add the points
  }
  return wordPoints * wordMultiplyer;
};

//////////////////////////////////////////////////

Game.prototype.getFirstLetters = function (newletters, orientation)
{
  var firstLetters = [];
  var l;

  if (orientation === 'vertical')
  {
    firstLetters.push (validator.findFirstHorizontal (newletters[0]));

    for (l = 0; l < newletters.length; l += 1)
    {
      if (validator.findWordVertical (newletters[l]).length > 1)
      {
      firstLetters.push (validator.findFirstVertical (newletters[l]));
      }
    }
  }
  else  // vertical
  {
    firstLetters.push (validator.findFirstVertical (newletters[0]));

    for (l = 0; l < newletters.length; l += 1)
    {
      if (validator.findWordHorizontal (newletters[l]).length > 1)
      {
      firstLetters.push (validator.findFirstHorizontal (newletters[l]));
      }
    }
  }
  return firstLetters;
};

//////////////////////////////////////////////////

Game.prototype.postNumTiles = function ()
{
  var numTiles = this.bag.letters.length;
  var tilesMessage = '';
  if (numTiles > 1)
  {
    tilesMessage = 'There are ' + numTiles + ' tiles left';
  } else if (numTiles === 1 ){
    tilesMessage = 'There is 1 tile left';
  } else{
    tilesMessage = 'There are no tiles left!';
  }
  $('#tilenums').text(tilesMessage);

  if(numTiles === 0)
  {
    this.turn.message = 'LAST TURN';
  }
};

Game.prototype.renderScore = function (recentScore)
{
  $('#score').empty();

  for (var p = 0; p < this.players.length; p ++)
  {
    $('#score').append('Player ' + (p+1) + ' Points: ' + this.players[p].score + '<br>');
  }

  if(this.recentScore)
  {
    $('#score').append('Player ' + (this.whoseTurn+1) +
      ' just played a word for ' + this.recentScore + ' points!');
  } else
  {
    $('#score').append('Player ' + (this.whoseTurn+1) + ' passed');
  }
};

Game.prototype.clearGameArea = function ()
{
  $('#score').empty();
  $('#game-info').empty();
  this.players.forEach(function(player)
  {
    player.tray.hideTray();
  });
};

module.exports = Game;
