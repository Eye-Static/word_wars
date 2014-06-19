'use strict';
var Square         = require('./Square');
var squareTemplate = require('./templates/squareTemplate.hbs');

module.exports = function Board ()
{
  this.maxX = 15;   // board width
  this.maxY = 15;   // board height

  this.grid = [];  // a 2D array to hold the squares

  for (var y = 0; y < this.maxY; y += 1)
  {
    this.grid[y] = [];
  }

  this.generate = function ()
  {
    // This long strings will allow us to easily reconfigure
    // the board's setup visually.
    // all
    var stupidGrid =
    'TW .. .. DL .. .. .. TW .. .. .. DL .. .. TW ' +
    '.. DW .. .. .. TL .. .. .. TL .. .. .. DW .. ' +
    '.. .. DW .. .. .. DL .. DL .. .. .. DW .. .. ' +
    'DL .. .. DW .. .. .. DL .. .. .. DW .. .. DL ' +
    '.. .. .. .. DW .. .. .. .. .. DW .. .. .. .. ' +
    '.. TL .. .. .. TL .. .. .. TL .. .. .. TL .. ' +
    '.. .. DL .. .. .. DL .. DL .. .. .. DL .. .. ' +
    'TW .. .. DL .. .. .. *  .. .. .. DL .. .. TW ' +
    '.. .. DL .. .. .. DL .. DL .. .. .. DL .. .. ' +
    '.. TL .. .. .. TL .. .. .. TL .. .. .. TL .. ' +
    '.. .. .. .. DW .. .. .. .. .. DW .. .. .. .. ' +
    'DL .. .. DW .. .. .. DL .. .. .. DW .. .. DL ' +
    '.. .. DW .. .. .. DL .. DL .. .. .. DW .. .. ' +
    '.. DW .. .. .. TL .. .. .. TL .. .. .. DW .. ' +
    'TW .. .. DL .. .. .. TW .. .. .. DL .. .. TW';

    // stupid_grid will get read by the function to create the letter
    // objects that will fill the 'smart grid'.

    $('#board').append ('<table>');
    $('#board').append('<tr>');
    var squares = stupidGrid.split(/\s+/);
    var y = 0;
    var x = 0;
    for (var i = 0; i < squares.length; i ++)
    {
      if(i % this.maxX === 0 && i!== 0)
      {
        $('#board').append ('</tr>');
        $('#board').append ('<tr>');
        y++;
      }
      x = i % this.maxX;

      var square = new Square();
      var thisSpace = squares[i];
      square.bonus = thisSpace;
      square.x = x;
      square.y = y;
      console.log('x is ' + x, 'y is ' + y);

      square.bonus  = thisSpace;
      thisSpace = (thisSpace === '*' ? 'start' : thisSpace);
      thisSpace = (thisSpace === '..' ? 'blank' : thisSpace);
      square.class += ' ' + thisSpace;

      $('#board').append(squareTemplate(square));

      this.grid[x][y] = square;  // add the actual square to the data grid

      // The invisible '.' needs to be on the blank div.
      // If the board divs are completely blank, the tiles shift downward for some reason.
      // A medal if you can figure out how to fix that.

      // if you need to print grid coordinates
      //$('#board').append ('<td><div class="' + square + ' ' + x + ', ' + y + '</div></td>');
    }
    $('#board').append ('</table>');
  };
};
