'use strict';
var Square         = require('./Square');
var Letter         = require('./Letter');
var squareTemplate = require('./templates/squareTemplate.hbs');
var letterTemplate = require('./templates/letterTemplate.hbs');
var grids          = require('./grids');

var Board = function (gridChoice)
{
  this.grid = [];
  this.players = null;
  var stringGrid;
  if(!gridChoice || grids.gridChoice)
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

Board.prototype.render = function (foundLetter)
{
  if(foundLetter)
  {
    console.log('YAY expedited render');
    this.renderOneLetter(foundLetter);
  }
  else
  {
    console.log('render everything again (in render func)');
    $('#board').empty();
    var lettersOnBoard = [];
    var ys = [];
    var xs = [];
    var el = '';
    $('#board').append ('<table id = "board-grid">');
    for (var y = 0; y < this.grid.length; y++) // one iteration is a whole row
    {
      el += '<tr>';
      for (var x = 0; x < this.grid[y].length; x++) //one iteration is one cell
      {
        var theSquare = this.grid[y][x];
        el += squareTemplate(theSquare);
        if(theSquare.letter)
        {
          theSquare.letter.y = y;
          theSquare.letter.x = x;
          lettersOnBoard.push(theSquare.letter);
        }
      }
      el += '</tr>';
    }
    $('#board-grid').append(el);
    console.log('letters on board are');
    for(var m = 0; m < lettersOnBoard.length; m++){ console.dir(lettersOnBoard[m]);}
    this.renderLetters(lettersOnBoard);
  }
};

//////////////////////////////////////////////////

Board.prototype.renderLetters = function (lettersOnBoard)
{
  while(lettersOnBoard.length>0)
  {
    this.renderOneLetter(lettersOnBoard.pop());
  }
};

Board.prototype.renderOneLetter = function(letterOnBoard)
{
  var boardRef = this;
  var letterObj  = letterOnBoard;
  console.log('I\'m rendering a ' + letterObj.character);
  var htmlLetter = $(letterTemplate(letterObj));
  $('#board').append(htmlLetter);  // put the div in the board
  htmlLetter.position(  // move the div to the square
  {
    my: 'top left',
    at: 'top left',
    of: '#square-' + letterObj.y + '-' + letterObj.x //destination
  });
  var letID = letterObj.id;
  if(letterObj.justPlaced)
  {
    htmlLetter.draggable( // this code is duplicated in tray
    {
      zIndex: 100,
      revert: 'invalid',
      containment: 'body',
      helper: function()
      {
        var clone = htmlLetter.clone().attr('id', letID);
        return clone;
      },
      start: function(event, ui)
      {
        $(this).css('opacity', 0);
      },
      stop: function(event, ui)
      {
        $(this).remove();
        //boardRef.render(letterObj); //!render
        //boardRef.addListeners(letterObj); //!removed something
      },
    });
  }
  // if(letterOnBoard.definition)
  // {
  //   htmlLetter.tooltip(
  //   {
  //     show: { effect: 'fade', duration: 0 },
  //     hide: { effect: 'fade', duration: 0 },
  //   });
  // }
};
//////////////////////////////////////////////////
Board.prototype.addListenerToSquare = function(foundLetter)
{

};
Board.prototype.addListeners = function(foundLetter)
{
  var boardRef = this;
  var droppableOptions =
  {
    drop: function (event, ui)
    {
      // get id of dropped letter
      var letterID  = ui.helper[0].id;
      var foundLetter = boardRef.retrieveLetter(letterID);
      var squareID  = this.id.split('-');
      foundLetter.y = squareID[1]; //change tile's x and y to new position
      foundLetter.x = squareID[2];
      foundLetter.justPlaced = true;
      console.log('letter ins drop listener is');
      console.dir(foundLetter);
      $(this).droppable('disable');
      boardRef.addDropListener(this, letterID, foundLetter);
    },

    over: function (event, ui)
    {
      $(this).css('box-shadow', 'inset 0px 0px 10px blue');
    },

    out: function (event, ui)
    {
      $(this).css('box-shadow', 'none');
    },
  };
  //if y exists, add listener to the square the letter came from
  //if y is null, letter is from tray so no new listener
  if(foundLetter && foundLetter.y !== null)
  {
    console.log('YAY expedited listener add');
    $('#board').find('#square-'+foundLetter.y+'-'+foundLetter.x).droppable(droppableOptions); //change to enable?
  }
  else if (!foundLetter)  //total rerender
  {
    console.log('no argument so rerendering whole board');
    $('#board').find('td:not(.XX):not(.has-letter)').droppable(droppableOptions);
  }
};

//////////////////////////////////////////////////
Board.prototype.addDropListener = function(htmlSquare, letterID, foundLetter)
{
  var boardRef = this;
  var dropSquare = this.getSquareObject (htmlSquare.id); // get the square object using the div's id
  var letterObj = foundLetter;
  console.log('found letter in addDropListener is');
  console.dir(letterObj);
  $('#done-button').val('Play Word'); //change button from 'pass' to 'play word'

  if(letterObj.score === 0) //blank tile scenario
  {
    blankTileDialog();
  }
  else
  {
    // assign the new letter object to the squares 'letter' field
    dropSquare.letter = letterObj;
    rerender(letterObj);
  }

  function blankTileDialog()
  {
    $('#overlay').fadeIn('slow');
    $('.popup').hide();
    $('#letter-select').show();
    $('#id'+letterID).position({of: htmlSquare}); //!not working for some reason
    $('.letter-button').on('click', function(e)
    {
      e.preventDefault();
      $('.letter-button').off('click');
      $('#overlay').fadeOut('slow');
      $('#letter-select').fadeOut('slow');
      letterObj.character = $(this).val();
      dropSquare.letter = letterObj;
      //rerender();
    });
  }
  function rerender()
  {
    boardRef.render(letterObj);  // redraw the board to stick the new letter to it visually
    //boardRef.addListeners (letterObj);
    for (var p = 0; p < boardRef.players.length; p += 1)
    {
      boardRef.players[p].tray.render();  // redraw the tray to clear the floaters we just dropped
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

// prints all the letters' justPlaced property on the board's grid[y][x] to console
Board.prototype.printBonus = function ()
{
  var x, y;
  var row;

  for (y = 0; y < this.maxY; y += 1)
  {
    row = '';

    for (x = 0; x < this.maxX; x += 1)
    {
      row += this.grid[y][x].bonus;
    }
    console.log (row);
  }
};

/////////////////////////////////////////////////
//this can be given a tray OR the players array
Board.prototype.retrieveLetter = function(letterID, tray)
{
  var foundLetter;
  if(tray) //a tray was given
  {
    foundLetter = tray.remove(letterID);
    if(foundLetter)
    {
      console.log('letter found on given tray');
      return foundLetter;
    }
  }
  else //no tray given, search all players trays
  {
    for(var i = 0; i < this.players.length; i ++)
    {
      foundLetter = this.players[i].tray.remove(letterID);
      if(foundLetter)
      {
        console.log('letter found on tray of player ' + i);
        return foundLetter;
      }
    }
  }
  //if tray didn't have the letter, find/remove letter from board
  console.log('letter found on board');
  foundLetter = this.retrieveBoardLetter(letterID);
  return foundLetter;
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
  var foundLetter = this.grid[y][x].letter;
  $('#id'+foundLetter.id).remove();//remove from DOM
  this.grid[y][x].letter = null; //remove from square
  this.addListeners(foundLetter); //add listeners back to the square
  return foundLetter;
};

module.exports = Board;
