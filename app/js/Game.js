'use strict';
var Board  = require('./Board');
var Bag    = require('./Bag');
var Player = require('./Player');

var Game = function (boardType, playerNum)
{
  console.log('starting new game with board type: ' + (boardType || 'not set'));
  console.log('and players: ' + (playerNum || 'not set'));

  this.board = new Board(boardType);
  this.bag   = new Bag();
  this.turn  = 0;
  this.players = [];

  for (var i = 0; i < (playerNum || 1); i++)
  {
    //console.log('creating player', i+1);
    this.players[i] = new Player();
  }

  this.board.render(this.players[0]); // player is passed for binding reasons
  this.bag.fill();               // add letters to bag
  this.bag.shake();              // randomize bag
  //console.log(this.bag.letters.length + ' letters generated');

  this.players[0].startTurn (this.bag);
};

module.exports = Game;
