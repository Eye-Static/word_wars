'use strict';
var Square         = require('./Square');
var squareTemplate = require('./templates/squareTemplate.hbs');
var grids          = require('./grids');

var Board = function (gridChoice)
{
  this.grid = [];
  var stringGrid;
  if(!gridChoice || !grids.hasOwnProperty(gridChoice))
  {
    console.log('board layout not found, defaulting to scrabble');
    gridChoice = 'scrabble';
  }
  // the grid defaults to scrabble layout if none or bad option

  this.maxX = grids[gridChoice].width;
  this.maxY = grids[gridChoice].height;

  for (var j = 0; j < this.maxX; j++)
  {
    this.grid[j] = new Array(this.maxY);
  }
  // create a grid maxX wide and maxY deep

  stringGrid = grids[gridChoice].grid;
  var squares = stringGrid.split(/\s+/);
  // stringGrid is split by 1+ spaces to create letter objects

  var y = -1;
  var x = -1;
  for (var i = 0; i < squares.length; i ++)
  {
    if(i % this.maxX === 0) { y ++;} //y increases every row

    x = i % this.maxX; //x increases every iteration, but resets every maxX turns

    var square = new Square();
    square.x = x;
    square.y = y;

    var thisSpace = squares[i];
    square.bonus = thisSpace;
    // the bonus field is same as the on the grid pattern
    // class may need to be adjusted
    if (thisSpace === '*' ) {thisSpace = 'start';}
    if (thisSpace === '..') {thisSpace = 'blank';}

    square.class = 'square ' + thisSpace;

    this.grid[y][x] = square;  // add square to the data grid
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
      var theSquare = $(squareTemplate(this.grid[i][j]));
      boardRef.append(theSquare); //render square
      if(this.grid[i][j].bonus !== 'XX')
      {
        theSquare.droppable(
        {
          drop: function (event, ui)
          {
            //var letter = $(ui.helper);
            console.log(this);
            console.log('this.offset is top', $(this).offset().top, 'left', $(this).offset().left);
            $('.ui-draggable-dragging').offset({
              top:  $(this).offset().top,
              left: $(this).offset().left
            });
            console.log('ui is ', ui.helper);
            console.dir(theSquare);
          }
        });
      }
    }
    boardRef.append ('</tr>');
  }
  boardRef.append ('</table>');
};

module.exports = Board;
