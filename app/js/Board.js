'use strict';
var Square         = require('./Square');
var squareTemplate = require('./templates/squareTemplate.hbs');
var grids          = require('./grids');
//var rowTemplate = require('./templates/rowTemplate.hbs');

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

//////////////////////////////////////////////////

// render is passed the player who's turn it is
Board.prototype.render = function (player)
{
  $('#board').empty();

  $('#board').append ('<table>');
  for (var i = 0; i < this.grid.length; i++) // one iteration is a whole row
  {
    var el = '<tr>';
    for (var j = 0; j < this.grid[i].length; j++) //one iteration is one cell
    {
      var theSquare = squareTemplate(this.grid[i][j]);
      el += theSquare;
    }
    el += '</tr>';
    $('table').append(el);
  }
  this.addListeners(player);
};

Board.prototype.addListeners = function(player)
{
  $('#board').find('td:not(.XX)').droppable(
  {
    drop: function (event, ui)
    {
      console.log('this.offset is top', $(this).offset().top, 'left', $(this).offset().left);
      $('.ui-draggable-dragging').position({of: $(this)});
      $(this).css('box-shadow', 'none');

      console.log('ui is ', ui.helper);

      // remove the dropped letter from the tray
      player.tray.remove (ui.helper[0].id);
    },

    over: function (event, ui)
    {
      $(this).css('box-shadow', 'inset 0px 0px 10px blue');
    },

    out: function (event, ui)
    {
      $(this).css('box-shadow', 'none');
    }

  });
};

module.exports = Board;
