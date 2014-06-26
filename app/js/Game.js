'use strict';
var Board  = require('./Board');
var Bag    = require('./Bag');
var Player = require('./Player');
var dictionary = require('./dictionary');
var GameButtons = require('./gameButtons');

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

  this.board.render(); // tray is passed for binding reasons
  this.board.addListeners(this.players); //now this must be called manually
  this.start();
};

Game.prototype.start = function()
{
  this.clearGameArea();
  this.printGameStatus();
  this.players[0].tray.showTray();
};

Game.prototype.finishTurn = function ()
{
  var justFinishedPlayer = this.players[this.whoseTurn];
  var recentScore = this.wordScore();
  justFinishedPlayer.score+= recentScore;
  this.renderScore(recentScore);
  justFinishedPlayer.refillTiles(this.bag);
  if(this.bag.letters.length === 0)
  { //no more letters
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

Game.prototype.checkWords = function()
{
  //input goes in as an array
  dictionary.lookup(['tyler', 'is', 'a', 'mensch'], function(returnData){
    console.dir(returnData);
    //returnData comes out as an array of objects like the following:
    //{word : 'the word', definition: 'definition' (or null if word not found)}
    //returnData is in SAME order as input, woohoo!
  });
};

Game.prototype.wordScore = function()
{
  var score = 0;
  var x,y;
  for(y=0;y<this.board.grid.length; y++){
    for(x=0;x<this.board.grid[y].length; x++){
      var letter = this.board.grid[y][x].letter;
      if(letter && letter.justPlaced) {
        letter.justPlaced = false;
        score += letter.score;
      }
    }
  }
  console.log('Score: ' + score);
  return score;
};

Game.prototype.renderScore = function (recentScore)
{
  $('#score').empty();
  var p = 0;
  for(p=0;p<this.players.length; p++) {
    $('#score').append('Player ' + (p+1) + ' Total: ' + this.players[p].score + '<br>');
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
};
module.exports = Game;
