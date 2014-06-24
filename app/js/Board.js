'use strict';
var Square         = require('./Square');
var Letter         = require('./Letter');
var squareTemplate = require('./templates/squareTemplate.hbs');
var letterTemplate = require('./templates/letterTemplate.hbs');
var grids          = require('./grids');
// var utils = require('./utils');
var Board = function (gridChoice)
{
  // console.dir(utils.game);
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
    //the y and x are reversed here, I think this is only important in creation
  }
};

//////////////////////////////////////////////////

// render is passed the current player
Board.prototype.render = function ()
{
  $('#board').empty();

  $('#board').append ('<table>');
  for (var y = 0; y < this.grid.length; y++) // one iteration is a whole row
  {
    var el = '<tr>';
    for (var x = 0; x < this.grid[y].length; x++) //one iteration is one cell
    {
      var theSquare = squareTemplate(this.grid[y][x]);
      el += theSquare;
    }
    el += '</tr>';
    $('table').append(el);
  }

  //this.addListeners(player);
  this.renderLetters();
};

//////////////////////////////////////////////////

Board.prototype.renderLetters = function ()
{
  var el = '';

  for (var y = 0; y < this.grid.length; y++) // one iteration is a whole row
  {
    for (var x = 0; x < this.grid[y].length; x++) //one iteration is one cell
    {
      if (this.grid[y][x].letter != null)  // if the square has a letter on it
      {
        var theLetter = letterTemplate (this.grid[y][x].letter);

        var theLetterArray = theLetter.split ('"');
        var theLetterID = theLetterArray[3];

        $('#board').append (theLetter);  // put the div in the board

        console.log ("Repositioning: #" + theLetterID);

        var destination = '#square-' + y.toString() + '-' + x.toString();

        $('#' + theLetterID).position (  // move the div to the square
        {
          my: 'center',
          at: 'center',
          of: '#square-' + y.toString() + '-' + x.toString()//destination
        });
      }
    }
  }
};

//////////////////////////////////////////////////

Board.prototype.addListeners = function(players)
{
  var that = this;

  $('#board').find('td:not(.XX)').droppable(
  {
    drop: function (event, ui)
    {
      console.log('this.offset is top', $(this).offset().top, 'left', $(this).offset().left);
      $('.ui-draggable-dragging').position({of: $(this)});
      $(this).css('box-shadow', 'none');
      //$(this).droppable('disable');

      // get id of dropped letter
      var letterID = ui.helper[0].id;

      // get the square object using the square div's id
      var dropSquare = that.getSquareObject (this.id);

      //search the player's tray and the board for the letter & take it
      var letter = that.retrieveLetter(letterID, players);

      // remove the dropped letter from the tray
      //players[].tray.remove (letterID);

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

// take the id (string) from a <td> square and return the square's object (grid[x][y])
// letterID = "square:x,y"
Board.prototype.getSquareObject = function (squareID)
{
  squareID = squareID.split ('-');
  var x = squareID[1];
  var y = squareID[2];

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
//this can be given a tray OR the players array
Board.prototype.retrieveLetter = function(letterID, input)
{
    var letter;
    console.dir(input);
    if(Array.isArray(input)) //players array, search ALL THE TRAYS!
    {
      for(var i = 0; i < input.length; i ++)
      {
        letter = input[i].tray.remove(letterID);
        if(letter)
        {
          console.log('letter was found on tray');
          console.log('removed id: ' + letterID);
          return letter;
        }
        //input[i].tray.render();
      }
    }
    else //tray was given instead of players array
    {
      letter = input.remove(letterID);
      if(letter)
      {
        console.log('letter was found on tray');
        console.log('removed id: ' + letterID);
        return letter;
      }
    }

    console.log('letter did not come from tray');
    //if tray didn't have the letter, find/remove letter from board
    letter = this.retrieveBoardLetter(letterID);
    return letter;
};

/////////////////////////////////////////////////

Board.prototype.retrieveBoardLetter = function (letterID)
{
  var x, y;
  for (y = 0; y < this.maxY; y += 1)
  {
    for (x = 0; x < this.maxX; x += 1)
    {
      if (this.grid[x][y].letter && this.grid[x][y].letter.id === letterID)
        {
          console.log('letter', this.grid[x][y].letter.character, 'found at', x, y);
          $('#square\\:' + x +'\\:'+ y).droppable('enable');
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
