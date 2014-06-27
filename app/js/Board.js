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

    if (thisSpace == '..') square.bonus = '•';
    else square.bonus = thisSpace;

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

Board.prototype.render = function (players)
{
  $('#board').empty();
  var lettersOnBoard = [];
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
      if(theSquare.letter && theSquare.letter.justPlaced)
      {
        ys.push(y);
        xs.push(x);
        lettersOnBoard.push(theSquare.letter);
      }
    }
    el += '</tr>';
    $('table').append(el);
  }
  this.renderLetters(lettersOnBoard, ys, xs, players);
};

//////////////////////////////////////////////////

Board.prototype.renderLetters = function (lettersOnBoard, ys, xs, playerRef)
{
  var boardRef = this;
  while(lettersOnBoard.length>0)
  {
    (function(){
      var theLetter = $(letterTemplate(lettersOnBoard.pop()));
      var letID = theLetter.attr('id');
      var players = playerRef; // !!!
      $('#board').append(theLetter);  // put the div in the board
      var y = ys.pop();
      var x = xs.pop();
      theLetter.position (  // move the div to the square
      {
        my: 'top left',
        at: 'top left',
        of: '#square-' + y + '-' + x //destination
      });

      theLetter.draggable( // this code is duplicated in tray
      {
        zIndex: 100,
        revert: 'invalid',
        containment: 'body',
        helper: function()
        {
          var clone = theLetter.clone().attr('id', letID);
          return clone;
        },
        start: function(event, ui)
        {
          $(this).css('opacity', 0);
        },
        stop: function(event, ui)
        {
          $(this).remove();
          boardRef.render(players);
          boardRef.addListeners(players);
        }
      });
    })();
  }
 };

//////////////////////////////////////////////////

Board.prototype.addListeners = function(playersRef)
{
  var boardRef = this;
  var players = playersRef; //!!!
  $('#board').find('td:not(.XX):not(.has-letter)').droppable(
  {
    drop: function (event, ui)
    {
      // get id of dropped letter
      var letterID = ui.helper[0].id;
      boardRef.render(players);
      boardRef.addListeners(players); //new !!!
      boardRef.addDropListener(this, letterID, players);
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
Board.prototype.addDropListener = function(square, letterID, players)
{
  var boardRef = this;

  // get the square object using the square div's id
  var dropSquare = this.getSquareObject (square.id);
  //search the player's tray and the board for the letter & take it
  var letter = this.retrieveLetter(letterID, players);
  letter.justPlaced = true;

  if(letter.score === 0)
  {
    $('#overlay').fadeIn('slow');
    $('#'+letterID).position({of: square});
    $('.letter-button').on('click', function(e)
    {
      e.preventDefault();
      $('.letter-button').off('click');
      $('#overlay').fadeOut('slow');
      letter.character = $(this).val();
      dropSquare.letter = letter;
      rerender();
    });
  }
  else
  {
    // assign the new letter object to the squares 'letter' field
    dropSquare.letter = letter;
    rerender();
  }
  function rerender()
  {
    boardRef.render (players);  // redraw the board to stick the new letter to it visually
    boardRef.addListeners (players);
    for (var p = 0; p < players.length; p += 1)
    {
      players[p].tray.render();  // redraw the tray to clear the floaters we just dropped
    }
  }
};

//////////////////////////////////////////////////

// take the id (string) from a <td> square and return the square's object (grid[y][x])
// letterID = 'square-y-x'
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

// prints all the letters' justPlaced property on the board's grid[y][x] to console
Board.prototype.printPlaced = function ()
{
  var x, y;
  var row;

  for (y = 0; y < this.maxY; y += 1)
  {
    row = '';

    for (x = 0; x < this.maxX; x += 1)
    {
      if (this.grid[y][x].letter)
        {
        if (this.grid[y][x].letter.justPlaced === true) row += 'T';
        else row += 'F';
        }
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

Board.prototype.retrieveBoardLetter = function (letterID)
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

Board.prototype.removeLetter = function (y, x)
{
  var letter = this.grid[y][x].letter;
  this.grid[y][x].letter = null;
  return letter;
};


module.exports = Board;
