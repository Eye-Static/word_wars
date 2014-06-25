'use strict';
var Board  = require('./Board');
var Bag    = require('./Bag');
var Player = require('./Player');

var Game = function (boardType, numOfPlayers)
{
  console.log('starting new game with board type: ' + (boardType || 'not set'));
  console.log('and players: ' + (numOfPlayers || 'not set'));

  this.board = new Board(boardType);
  this.bag   = new Bag();
  this.turn  = {turnNum: 1, message: ''};
  this.players = [];
  this.whoseTurn = 0; // refers to which player in players array
                      // so 0 means the first player

  this.bag.fill();               // add letters to bag
  this.bag.shake();              // randomize bag

  for (var i = 0; i < (numOfPlayers || 1); i++)
  {
    this.players[i] = new Player(this.board, i);//pass board & the player number
    this.players[i].refillTiles (this.bag);
  }

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
};

Game.prototype.finishTurn = function ()
{
  var justFinishedPlayer = this.players[this.whoseTurn];

  var recentScore = this.wordScore();
  justFinishedPlayer.score += recentScore;
  this.renderScore(recentScore);

  justFinishedPlayer.refillTiles(this.bag);
  if(this.bag.letters.length === 0)
  { //no more letters
    console.log('No more letters in the bag, last turn');
    this.turn.message = 'LAST TURN';
  }
  justFinishedPlayer.tray.render();
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

Game.prototype.printGameStatus = function ()
{
  //change what this is connected to on the DOM
  $('#game-info').text('player ' + (this.whoseTurn+1) +
  '\'s turn. Turn: ' + (this.turn.message || this.turn.turnNum));
};

Game.prototype.cleanGameSpace = function ()
{
  $('#player-1-tray').empty();
  $('#player-2-tray').empty();
};

//////////////////////////////////////////////////

// returns the score of the new letters placed this turn
Game.prototype.wordScore = function()
{
 // get an array of all the new letter coordinates
  var newletters = this.getNewLetters();
  var score = 0;
  var y, x, l;

  for (l = 0; l < newletters.length; l += 1)
  {
    y = newletters[l][0];
    x = newletters[l][1];
    score += this.board.grid[y][x].letter.score;      // add the points
    this.board.grid[y][x].letter.justPlaced = false;  // clear the justPlaced flag
  }

  console.log("Score: " + score);
  return score;
}

//////////////////////////////////////////////////

// check if placed letters are in a straight line
// returns "horizontal", "vertical", or null
Game.prototype.isLine = function ()
{
 // get an array of all the new letter coordinates
  var newletters = this.getNewLetters();
  var l;

  // check x and y in the new array for straight lines
  var isHorizontal = true;
  var isVertical = true;
  for (l = 1; l < newletters.length; l += 1)
  {
    if (newletters[l][0] != newletters[0][0])  // y coordinates do not match
    {
      isVertical = false;
    }
    if (newletters[l][1] != newletters[0][1])  // x coordinates do not match
    {
      isHorizontal = false;
    }
  }
  if (isVertical == true) return "vertical";
  else if (isHorizontal == true) return "horizontal";
  else return null;
}

//////////////////////////////////////////////////

// returns a 2D array of grid coordinates [y, x] for all new letters on the board
Game.prototype.getNewLetters = function ()
{
  var newletters = [];  // an array to hold pairs of coordinates of the new letters

  // run through the grid
  for (var y = 0; y < this.board.grid.length; y += 1)
  {
    for (var x = 0; x < this.board.grid[y].length; x += 1)
    {
      if (this.board.grid[y][x].letter && this.board.grid[y][x].letter.justPlaced == true)
      {
        newletters.push ([y, x]);
      }
    }
  }
  return newletters;
}

//////////////////////////////////////////////////

Game.prototype.renderScore = function () 
{
  $("#score").empty();

  for (var p = 0; p < this.players.length; p ++) 
  {
    $("#score").append("Player " + (p+1) + " Points: " + this.players[p].score + "<br>");
  }
  $('#score').append('Player ' + (this.whoseTurn+1) +
    ' just played a word for ' + recentScore + ' points!');
};

Game.prototype.clearGameArea = function (recentScore)
{
  $('#score').empty();
  $('#game-info').empty();
  this.players.forEach(function(player)
  {
    player.tray.hideTray();
  });
}

module.exports = Game;
