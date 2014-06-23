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
};

//////////////////////////////////////////////////

// render is passed the current player
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

//////////////////////////////////////////////////

Board.prototype.addListeners = function(player)
{
  var that = this;

  $('#board').find('td:not(.XX)').droppable(
  {
    drop: function (event, ui)
    {
      console.log('this.offset is top', $(this).offset().top, 'left', $(this).offset().left);
      $('.ui-draggable-dragging').position({of: $(this)});
      $(this).css('box-shadow', 'none');

      // letter with what ID was dropped?
      var letterID = ui.helper[0].id;

      // get the square object using the square div's id
      var dropSquare = that.getSquareObject (this.id);
      var letter = that.retrieveLetter(letterID, player);

      // assign the new letter object to the squares 'letter' field
      dropSquare.letter = letter;
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

//////////////////////////////////////////////////

// take the id (string) from a <td> square and return the square's object (grid[x][y])
// letterID = "square:x,y"
Board.prototype.getSquareObject = function (letterID)
{
  letterID = letterID.split (':');
  var x = letterID[1];
  var y = letterID[2];

  return this.grid[x][y];
};

//////////////////////////////////////////////////

// prints all the letters stored on the board's grid[x][y] to console
Board.prototype.printGrid = function ()
{
  var x, y;
  var row;

  for (y = 0; y < this.maxY; y += 1)
  {
    row = '';

    for (x = 0; x < this.maxX; x += 1)
    {
      if (this.grid[x][y].letter) { row += this.grid[x][y].letter.character; }
      else { row += '.'; }
    }
    console.log (row);
  }
};
/////////////////////////////////////////////////

Board.prototype.retrieveLetter = function(letterID, playerTray)
{
    // remove the dropped letter from the tray
    console.log('letter ID is', letterID, 'and letter removed is:');
    var letter = player.tray.remove(letterID);

    if(letter)
    {
      console.log('letter was found on tray of player:');
      console.dir(player);
    }
    else
    {
      //if tray didn't have the letter, find/remove letter from board
      console.log('letter did not come from tray');
      letter = this.board.findAndRemoveLetter(letterID);
    }

    console.log('removed id: ' + letterID + ' with letter object ');
    console.dir(letter);
    return letter;
};

/////////////////////////////////////////////////

Board.prototype.findAndRemoveLetter = function (letterID)
{
  var x, y;
  for (y = 0; y < this.maxY; y += 1)
  {
    for (x = 0; x < this.maxX; x += 1)
    {
      if (this.grid[x][y].letter && this.grid[x][y].letter.id === letterID)
        {
          console.log('letter ' + this.grid[x][y].letter.character + ' found at ' + x + ' ' + y);
          return this.removeLetter(x,y);
        }
    }
  }
};
////////////////////////////////////////////////


Board.prototype.removeLetter = function (x, y)
{
  var letter = this.grid[x][y].letter;
  this.grid[x][y].letter = null;
  return letter;
};


module.exports = Board;
