'use strict';
var Board  = require('./Board');
var Bag    = require('./Bag');
var Player = require('./Player');
// var utils  = ('./utils');

var Game = function (boardType, playerNum)
{
  console.log('starting new game with board type: ' + (boardType || 'not set'));
  console.log('and players: ' + (playerNum || 'not set'));

  this.board = new Board(boardType);
  this.bag   = new Bag();
  this.turn  = 0;
  this.players = [];
  this.whoseTurn = 0; //no 0 player number but will increase
  // utils.setGame(this);
  // utils.players = this.players;
  // utils.board = this.board;

  this.bag.fill();               // add letters to bag
  this.bag.shake();              // randomize bag

  for (var i = 0; i < (playerNum || 1); i++)
  {
    console.log('creating player', i+1);
    this.players[i] = new Player(this.board, i+1);//pass board & playerNum
    this.players[i].refillTiles (this.bag);
  }

  this.board.render(); // tray is passed for binding reasons
  this.board.addListeners(this.players); //now this must be called manually
  this.start();
};

Game.prototype.start = function()
{
  //more to come in this space??
  this.nextTurn();
};

Game.prototype.nextTurn = function()
{
  //change what this is connected to
  this.turn ++;
  console.log('turn is now ' + this.turn);
  this.whoseTurn = this.players[this.whoseTurn] ? this.whoseTurn + 1 : 1;
  console.log(this.whoseTurn);
  $('#connection-info').text('player ' + this.whoseTurn + '\'s turn.');
};

module.exports = Game;
