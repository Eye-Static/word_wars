'use strict';
var Letter = require('./Letter');
var Bag = require('./Bag');
var letterTemplate = require('./templates/letterTemplate.hbs');

module.exports = function Tray ()
{
  this.letters = [];  // array of letter objects (max 7)

  //////////////////////////////////////////////////

  // remove letters from the bag and add them to the tray
  // until the tray has 7.
  this.refill = function (bag)
  {
    while (this.letters.length < 7)
    {
      this.letters.push(bag.removeNext());
    }
  };
  //////////////////////////////////////////////////

  // find a letter in the tray by id and return the array index
  this.find = function (id)
  {
    for (var x = 0; x < this.letters.length; x += 1)
    {
      if (this.letters[x].id === id) return x;
    }
    return -1;
  };
  //////////////////////////////////////////////////

  // add one specific letter to the tray
  this.add = function (letterObj)
  {
    this.letters.push(letterObj);
  };

  //////////////////////////////////////////////////

  // remove one letter from the tray by id
  this.remove = function (id)
  {
    var index = this.find (id);
    if (index < 0) { return null; }
    var returnVal = this.letters.splice(index, 1);
    if (returnVal > 1) {console.error('tray found', returnVal.length, 'letters with same id');}
    return returnVal[0];
  };
  /////////////////////////////////////////////////

  this.retrieveLetter = function(letterID, board)
  {
    console.log('this in tray is');
    console.dir(this);
    var letter = board.retrieveLetter(letterID, this);
    return letter;
  };

  //////////////////////////////////////////////////

  // draw the tray letters
  this.render = function (board)
  {
    var that = this;
    $('#tray').empty();
    for(var i=0; i<this.letters.length; i++)
    {
      var letterHtml = $(letterTemplate(this.letters[i]));
      var letterData = this.letters[i];
      $('#tray').append(letterHtml);
      letterHtml.draggable(
      {
        stop: function ()
        {},
        start: function (event)
        {},
        zIndex: 20,
        revert: 'invalid',
      });
    }
    $('#tray').droppable(
    {
      drop: function (event, ui)
      {
        $('.ui-draggable-dragging').offset(
        {
          top: $(this).offset().top +12,
          //set height to sit in middle of tray
        });
        var letterID = ui.helper[0].id;
        var letter = that.retrieveLetter(letterID, board);
        that.add(letter);
      }
    });
  };

  //////////////////////////////////////////////////

  this.print = function ()
  {
    var output = '';

    for (var x = 0; x < this.letters.length; x += 1)
    {
      output = output.concat (this.letters[x].character + ' ');
      //console.log (this.letters[x].character);
    }
    console.log ('Player 1 Tray Data: ' + output);
  };

  //////////////////////////////////////////////////

  this.shuffle = function ()
  {
    var temp;  // for storing a letter to do the swap
    var y;     // the random letter

    for (var x = 0; x < this.letters.length; x += 1)
    {
      temp = this.letters[x];
      y = Math.floor (Math.random() * this.letters.length);
      this.letters[x] = this.letters[y];
      this.letters[y] = temp;
    }
  };

};
