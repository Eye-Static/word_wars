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

  this.maxX = grids[gridChoice].width;
  this.maxY = grids[gridChoice].height;

  for (var j = 0; j < this.maxY; j++)
  {
    this.grid[j] = new Array(this.maxX);
  }
  // create a grid maxX wide and maxY deep

  stringGrid = grids[gridChoice].grid;
  var squares = stringGrid.split(/\s+/);
  // stringGrid is split by 1+ spaces to create squares

  var y = -1;
  var x;
  for (var i = 0; i < squares.length; i ++)
  {
    if(i % this.maxX === 0) { y ++;} //y increases every row

    x = i % this.maxX; //x increases every iteration, but resets every maxX turns

    var square = new Square();
    square.x = x;
    square.y = y;

    var thisSpace = squares[i];

    if (thisSpace == '..') square.bonus = "&bull;";//'•';
    else square.bonus = thisSpace;

    // the bonus field is same as the on the grid pattern
    // class may need to be adjusted
    if (thisSpace === '*' ) {thisSpace = 'start';}
    if (thisSpace === '..') {thisSpace = 'blank';}

    square.class = 'square ' + thisSpace;

    this.grid[y][x] = square;  // add square to the data grid
  }
};

//////////////////////////////////////////////////

Board.prototype.renderAll = function ()
{
  $('#board').empty();
  var lettersOnBoard = [];
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
  this.renderLetters(lettersOnBoard);
};

//////////////////////////////////////////////////

Board.prototype.renderLetters = function (lettersOnBoard)
{
  while(lettersOnBoard.length>0)
  {
    this.renderOneLetter(lettersOnBoard.pop());
  }
};

Board.prototype.renderOneLetter = function(letterObj)
{
  var boardRef = this;
  var htmlLetter = $(letterTemplate(letterObj));

  $('#board').append(htmlLetter);  // put the div in the board
  htmlLetter.position(  // move the div to the square
  {
    my: 'top left',
    at: 'top left',
    of: '#square-' + letterObj.y + '-' + letterObj.x
  });

  var letID = letterObj.id;
  var clone;
  if(letterObj.justPlaced)
  {
    htmlLetter.draggable(
    {
      zIndex: 100,
      revert: function(droppableObj)
      {
        if(droppableObj === false) //is reverting
        {
          // Reset id which also removes 'dead' id.
          // Takes clone 500ms to revert so
          // make 'dead' letter visible again after 500ms
          htmlLetter.attr('id', letID);
          var that = this;
          setTimeout(function()
          {
            $(that).css('opacity', 1);
          }, 500)

          return true;
        }
        else  //not reverting
        {
          return false;
        }
      },
      containment: 'body',
      helper: function()
      {
        // Drag clone helper instead of real letter
        // because clone can escape bounds of the board.
        // Set real letter.id to dead.
        clone = htmlLetter.clone();
        htmlLetter.attr('id', 'dead');
        clone.attr('id', letID);
        return clone;
      },
      start: function(event, ui)
      {
        // Make the letter invisible so only clone can be seen.
        $(this).css('opacity', 0);
      },
    });
  }
  // if(letterOnBoard.definition) //not working yet
  // {
  //   htmlLetter.tooltip(
  //   {
  //     show: { effect: 'fade', duration: 0 },
  //     hide: { effect: 'fade', duration: 0 },
  //   });
  // }
};
//////////////////////////////////////////////////

Board.prototype.addListeners = function(htmlSquare)
{
  var boardRef = this;
  var droppableOptions =
  {
    drop: function (event, ui)
    {
      var letterID    = ui.helper[0].id;   // get id of dropped letter
      var foundLetter = boardRef.retrieveLetter(letterID);

      $('#dead').removeClass('ui-draggable').removeAttr('id');
      //removing draggable class so no way to interact with dead letter
      //dead letters are removed on every full rerender

      if(foundLetter.y !== null)
      {
        var prevSquare = $('#square-'+foundLetter.y+'-'+foundLetter.x);
        boardRef.addListeners(prevSquare);  // add listener to where the tile left
      }

      var squareID    = this.id.split('-');
      foundLetter.y   = squareID[1];    //change tile's x and y to new position
      foundLetter.x   = squareID[2];
      foundLetter.justPlaced = true;

      $(this).addClass('has-letter');
      $(this).css('box-shadow', 'none');
      $(this).droppable('destroy');
      boardRef.onTileDrop(foundLetter); //uses x/y to position letter
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

  if(htmlSquare)
  {
    console.log('Reactivating listener on ' + htmlSquare.selector);
    $(htmlSquare).droppable(droppableOptions);
    $(htmlSquare).removeClass('has-letter');
  }
  else
  {
    console.log('adding all listeners again');
    $('#board').find('td:not(.XX):not(.has-letter)').droppable(droppableOptions);
  }
};

//////////////////////////////////////////////////
Board.prototype.onTileDrop = function(letterObj)
{
  var boardRef = this;
  var dropSquare = this.grid[letterObj.y][letterObj.x];
  $('#done-button').val('Play Word'); //change button from 'pass' to 'play word'

  for (var p = 0; p < this.players.length; p += 1)
  {
    this.players[p].tray.render();  // redraw the tray to clear the floaters we just dropped
  }

  if(letterObj.score === 0) //blank tile scenario
  {
    blankTileDialog();
  }
  else
  {
    dropSquare.letter = letterObj;
    this.renderOneLetter(letterObj); // draw the letter
  }

  function blankTileDialog()
  {
    $('#overlay').fadeIn('slow');
    $('.popup').hide();
    $('#letter-select').show();
    $('#id'+letterObj.id).position({of: $('#square-'+letterObj.y+'-'+letterObj.x)}); //! not working
    $('.letter-button').on('click', function(e)
    {
      e.preventDefault();
      $('.letter-button').off('click');
      $('#overlay').fadeOut('slow');
      $('#letter-select').fadeOut('slow');
      letterObj.character = $(this).val();
      dropSquare.letter = letterObj;
      boardRef.renderOneLetter(letterObj); // draw the letter
    });
  }
};

/////////////////////////////////////////////////

Board.prototype.retrieveLetter = function(letterID)
{
  var foundLetter;
  for(var i = 0; i < this.players.length; i ++)
  {
    foundLetter = this.players[i].tray.remove(letterID);
    if(foundLetter)
    {
      return foundLetter;
    }
  }
  // Could not find letter on trays, find/remove letter from board
  foundLetter = this.findAndRemove(letterID);
  return foundLetter;
};

/////////////////////////////////////////////////
// Find the coordinates for a letter, doesn't remove it
Board.prototype.findAndRemove = function (letterID)
{
  var x, y;
  for (y = 0; y < this.maxY; y += 1)
  {
    for (x = 0; x < this.maxX; x += 1)
    {
      if (this.grid[y][x].letter && this.grid[y][x].letter.id === letterID)
      {
        console.log('letter', this.grid[y][x].letter.character, 'located at x', x, 'y', y);
        var foundLetter = this.grid[y][x].letter;
        this.grid[y][x].letter = null;
        return foundLetter;
      }
    }
  }
};

//////////////////////////////////////////////////
// A printer function for the grid, pass in a function for what to print from a square

Board.prototype.printer = function(func)
{
  var row;
  for (var y = 0; y < this.maxY; y += 1)
  {
    row = '';
    for (var x = 0; x < this.maxX; x += 1)
    {
      row += func(this.grid[y][x]);
    }
    console.log(row);
  }
};

//////////////////////////////////////////////////
// prints all the letters stored on the board's grid[y][x] to console

Board.prototype.printGrid = function ()
{
  this.printer(function(square)
  {
    if (square.letter) { return square.letter.character; }
    else               { return '.'; }
  });
};

/////////////////////////////////////////////////
// prints all the letters' justPlaced property on the board's grid[y][x] to console

Board.prototype.printPlaced = function ()
{
  this.printer(function(square)
  {
    if (square.letter)
    {
      return square.letter.justPlaced ? 'T' : 'F';
    }
    else { return '.'; }
  });
};

/////////////////////////////////////////////////
// prints all the letters' justPlaced property on the board's grid[y][x] to console

Board.prototype.printBonus = function ()
{
  this.printer(function(square)
  {
    return square.bonus;
  });
};

module.exports = Board;
