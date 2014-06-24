'use strict';
var Board  = require('./Board');
var Bag    = require('./Bag');
var Player = require('./Player');
// var utils  = ('./utils');

var Game = function (boardType, numOfPlayers)
{
  console.log('starting new game with board type: ' + (boardType || 'not set'));
  console.log('and players: ' + (numOfPlayers || 'not set'));
  this.cleanGameSpace();

  this.board = new Board(boardType);
  this.bag   = new Bag();
  this.turn  = {turnNum: 1, message: ''};
  this.players = [];
  this.whoseTurn = 0; // refers to which player in players array
                      // so 0 means the first player
  // utils.setGame(this);
  // utils.players = this.players;
  // utils.board = this.board;

  this.bag.fill();               // add letters to bag
  this.bag.shake();              // randomize bag

  for (var i = 0; i < (numOfPlayers || 1); i++)
  {
    console.log('creating player', i);
    this.players[i] = new Player(this.board, i);//pass board & the player number
    this.players[i].refillTiles (this.bag);
  }

  this.board.render(); // tray is passed for binding reasons
  this.board.addListeners(this.players); //now this must be called manually
  this.start();
};

Game.prototype.start = function()
{
  //more to come in this space??
  this.printGameStatus();
};

Game.prototype.finishTurn = function ()
{
  var justFinishedPlayer = this.players[this.whoseTurn];
  console.dir(justFinishedPlayer);
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
  // set whoseTurn to the next player
  this.whoseTurn = this.players[this.whoseTurn +1] ? this.whoseTurn + 1 : 0;
  this.printGameStatus();
};

Game.prototype.printGameStatus = function ()
{
  //change what this is connected to on the DOM
  $('#connection-info').text('player ' + (this.whoseTurn+1) +
  '\'s turn. Turn: ' + (this.turn.message || this.turn.turnNum));
}

Game.prototype.cleanGameSpace = function ()
{
  $('#player-1-tray').empty();
  $('#player-2-tray').empty();
};

module.exports = Game;
