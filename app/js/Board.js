'use strict';
var Square         = require('./Square');
var squareTemplate = require('./templates/squareTemplate.hbs');
var grids          = require('./grids');


var Board = function (gridChoice)
{

  this.grid = [];
  var stringGrid;
  if(!gridChoice || !grids.hasOwnProperty('gridChoice'))
  {
    console.log('board layout not found, defaulting to scrabble');
    gridChoice = 'scrabble';
  }

  // the grid defaults to scrabble layout if none or bad option
  // is specfified current other option is 'wordsWithFriends'

  stringGrid = grids[gridChoice].grid;

  // stringGrid is read to create the letter objects that will fill
  // the this.grid object

  this.maxX = grids[gridChoice].width;   // board width
  this.maxY = grids[gridChoice].height;  // board height
  for (var j = 0; j < this.maxX; j++)
  {
    this.grid[j] = new Array(this.maxY);
  }
  // create a grid maxX wide and maxY deep

  var squares = stringGrid.split(/\s+/);
  var y = -1;
  var x = -1;
  for (var i = 0; i < squares.length; i ++)
  {
    if(i % this.maxX === 0) { y ++;}
    //y increases every row

    x = i % this.maxX;
    //x increases every iteration & starts again at 0 at the start of every row

    var square    = new Square();
    var thisSpace = squares[i];
    square.x = x;
    square.y = y;
    //console.log('x is ' + x + ' y is ' + y + ' bonus is ' + thisSpace);

    square.bonus = thisSpace;
    //the bonus is always the same as the on the grid pattern

    if (thisSpace === '*' ) {thisSpace = 'start';}
    if (thisSpace === '..') {thisSpace = 'blank';}

    square.class += ' ' + thisSpace;
    //the actual class may need a little changing from the grid pattern

    // The invisible '..' needs to be on the blank div.
    // If the board divs are completely blank, the tiles shift downward for some reason.
    // A medal if you can figure out how to fix that.

    this.grid[y][x] = square;  // add the square to the data grid
  }
  return this;
};

Board.prototype.render = function ()
{
  var boardRef = $('#board');
  boardRef.html('');

  boardRef.append ('<table>');
  for (var i = 0; i < this.grid.length; i++) // one iteration is a whole row
  {
    boardRef.append ('<tr>');

    for (var j = 0; j < this.grid[i].length; j++) //one iteration is one cell
    {
      boardRef.append(squareTemplate(this.grid[i][j]));
      //render the square using square template and the square's data
    }
    boardRef.append ('</tr>');
  }
  boardRef.append ('</table>');
};

module.exports = Board;
