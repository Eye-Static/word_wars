'use strict';
var Board  = require('./Board');
var Bag    = require('./Bag');
var Player = require('./Player');
var GameButtons = require('./gameButtons');
var validator = require('./validator');

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
};

Game.prototype.finishTurn = function ()
{
  var justFinishedPlayer = this.players[this.whoseTurn];

  var recentScore = this.wordScore();
  justFinishedPlayer.score += recentScore;
  this.renderScore(recentScore);

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
  var score = 0;
  var y, x, l;

  for (l = 0; l < newletters.length; l += 1)
  {
    y = newletters[l][0];
    x = newletters[l][1];
    score += this.board.grid[y][x].letter.score;      // add the points
    this.board.grid[y][x].letter.justPlaced = false;  // clear the justPlaced flag
  }

  console.log('Score: ' + score);
  return score;
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

  if(recentScore)

  {

  $('#score').append('Player ' + (this.whoseTurn+1) +
    ' just played a word for ' + recentScore + ' points!');
  }
};

Game.prototype.clearGameArea = function (recentScore)
{
  $('#score').empty();
  $('#game-info').empty();
  this.players.forEach(function(player)
  {
    player.tray.hideTray();
  });
};

module.exports = Game;
