'use strict';
var Square         = require('./Square');
var squareTemplate = require('./templates/squareTemplate.hbs');
var grids          = require('./grids');

module.exports = function Board ()
{
  this.generate = function (gridChoice)
  {
    gridChoice  = gridChoice || 'scrabble';
    // the grid defaults to scrabble layout if none specified
    // other option is 'wordsWithFriends'

    var stringGrid = grids[gridChoice].grid;
    // stringGrid is read to create the letter objects that will fill
    // the this.grid object

    this.maxX = grids[gridChoice].width;   // board width
    this.maxY = grids[gridChoice].height;   // board height
    this.grid = [];
    for (var j = 0; j < this.maxX; j++)
    {
      this.grid[j] = new Array(this.maxY);
    }
    // create a grid maxX wide and maxY deep

    $('#board').append ('<table>');
    var squares = stringGrid.split(/\s+/);
    var y = 0;
    var x = 0;
    for (var i = 0; i < squares.length; i ++)
    {

      if(i % this.maxX === 0)
      {
        $('#board').append ('<tr>');
        y++;
      }
      //y increases every row and a new html row is started

      x = i % this.maxX;
      //x increases every iteration & starts again at 0 at the start of every row

      var square    = new Square();
      var thisSpace = squares[i];
      square.x = x;
      square.y = y;

      square.bonus = thisSpace;
      //the bonus is always the same as the on the grid pattern

      thisSpace = (thisSpace === '*'  ? 'start' : thisSpace);
      thisSpace = (thisSpace === '..' ? 'blank' : thisSpace);
      square.class += ' ' + thisSpace;
      //the actual class may need a little changing from the grid pattern

      // The invisible '..' needs to be on the blank div.
      // If the board divs are completely blank, the tiles shift downward for some reason.
      // A medal if you can figure out how to fix that.

      $('#board').append(squareTemplate(square));
      //render the square using square template and the square's data

      if(i % this.maxX === 0) { $('#board').append ('</tr>'); }
      //end the html row when the data row ends

      this.grid[x][y] = square;  // add the actual square to the data grid

    }
    $('#board').append ('</table>');
  };
};
