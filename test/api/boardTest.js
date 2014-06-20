'use strict';
var expect = require('chai').expect;
var Board  = require('../../app/js/Board');

describe('test board functions', function() {
  var board;
  before(function(done){
    done();

  });

  it('generate scrabble board', function() {
    board = new Board();
    expect(board).to.be.an('object');
    expect(board.grid).to.be.an('array');
    expect(board.grid[0]).to.be.an('array');
  });

  // it('return destination equals tacoma', function () {
  //   expect(result.Tb.destination).to.be.equal('tacoma');
  // });
});

