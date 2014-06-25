'use strict';
var Square         = require('./Square');
var Letter         = require('./Letter');
var squareTemplate = require('./templates/squareTemplate.hbs');
var letterTemplate = require('./templates/letterTemplate.hbs');
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

  for (var j = 0; j < this.maxY; j++)
  {
    this.grid[j] = new Array(this.maxX);
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
    //the y and x are reversed here, I think this is only important in creation
  }
};

//////////////////////////////////////////////////

Board.prototype.render = function ()
{
  $('#board').empty();
  var squaresWithLetters = [];
  var ys = [];
  var xs = [];
  $('#board').append ('<table>');
  for (var y = 0; y < this.grid.length; y++) // one iteration is a whole row
  {
    var el = '<tr>';
    for (var x = 0; x < this.grid[y].length; x++) //one iteration is one cell
    {
      var theSquare = this.grid[y][x];
      el += squareTemplate(theSquare);
      if(theSquare.letter)
      {
        ys.push(y);
        xs.push(x);
        squaresWithLetters.push(theSquare);
      }
    }
    el += '</tr>';
    $('table').append(el);
  }
  this.renderLetters(squaresWithLetters, ys, xs);
};

//////////////////////////////////////////////////

Board.prototype.renderLetters = function (squaresWithLetters, ys, xs)
{
  var el = '';
  while(squaresWithLetters.length>0)
  {
    var theLetter = $(letterTemplate(squaresWithLetters.pop().letter));

    $('#board').append(theLetter);  // put the div in the board

    var y = ys.pop();
    var x = xs.pop();

    theLetter.position (  // move the div to the square
    {
      my: 'center',
      at: 'center',
      of: '#square-' + y + '-' + x //destination
    });

    theLetter.draggable( // this code is duplicated in tray
    {
      zIndex: 100,
      revert: 'invalid'
    });

  }
 };

//////////////////////////////////////////////////

Board.prototype.addListeners = function(players)
{
  var that = this;

  $('#board').find('td:not(.XX):not(.has-letter)').droppable(
  {
    drop: function (event, ui)
    {
      // get id of dropped letter
      var letterID = ui.helper[0].id;

      // get the square object using the square div's id
      var dropSquare = that.getSquareObject (this.id);

      //search the player's tray and the board for the letter & take it
      var letter = that.retrieveLetter(letterID, players);

      // assign the new letter object to the squares 'letter' field
      dropSquare.letter = letter;

      that.render ();  // redraw the board to stick the new letter to it visually
      that.addListeners (players);
      for (var p = 0; p < players.length; p += 1)
      {
        players[p].tray.render();  // redraw the tray to clear the floaters we just dropped
      }
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

// take the id (string) from a <td> square and return the square's object (grid[y][x])
// letterID = "square-x-y"
Board.prototype.getSquareObject = function (squareID)
{
  squareID = squareID.split ('-');
  var y = squareID[1];
  var x = squareID[2];

  return this.grid[y][x];
};

//////////////////////////////////////////////////

// prints all the letters stored on the board's grid[y][x] to console
Board.prototype.printGrid = function ()
{
  var x, y;
  var row;

  for (y = 0; y < this.maxY; y += 1)
  {
    row = '';

    for (x = 0; x < this.maxX; x += 1)
    {
      if (this.grid[y][x].letter) { row += this.grid[y][x].letter.character; }
      else { row += '.'; }
    }
    console.log (row);
  }
};
/////////////////////////////////////////////////
//this can be given a tray OR the players array
Board.prototype.retrieveLetter = function(letterID, input)
{
    var letter;
    if(Array.isArray(input)) //players array, search ALL THE TRAYS!
    {
      for(var i = 0; i < input.length; i ++)
      {
        letter = input[i].tray.remove(letterID);
        if(letter)
        {
          return letter;
        }
      }
    }
    else //tray was given instead of players array
    {
      letter = input.remove(letterID);
      if(letter)
      {
        return letter;
      }
    }
    //if tray didn't have the letter, find/remove letter from board
    letter = this.retrieveBoardLetter(letterID);
    return letter;
};

/////////////////////////////////////////////////

Board.prototype.retrieveBoardLetter = function (letterID) //!!!
{
  var x, y;
  for (y = 0; y < this.maxY; y += 1)
  {
    for (x = 0; x < this.maxX; x += 1)
    {
      if (this.grid[y][x].letter && this.grid[y][x].letter.id === letterID)
        {
          console.log('letter', this.grid[y][x].letter.character, 'retrieved from x', x, 'y', y);
          return this.removeLetter(y,x);
        }
    }
  }
};

////////////////////////////////////////////////

Board.prototype.removeLetter = function (y, x) //!!!
{
  var letter = this.grid[y][x].letter;
  this.grid[y][x].letter = null;
  return letter;
};


module.exports = Board;
