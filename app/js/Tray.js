'use strict';
var Letter = require('./Letter');
var Bag = require('./Bag');
var letterTemplate = require('./templates/letterTemplate.hbs');

module.exports = function Tray (boardRef, playerNum)
{
  this.letters = [];  // array of letter objects (max 7)
  this.playerNum = playerNum;
  var trayObject = $('#player-' + playerNum + '-tray');

  //////////////////////////////////////////////////

  // remove letters from the bag and add them to the tray
  // until the tray has 7.
  this.refill = function (bag)
  {
    while (this.letters.length < 7)
    {
      var letter = bag.removeNext();
      if(!letter) { return; }  //no more letters, exit
      this.letters.push(letter);
    }
  };
  //////////////////////////////////////////////////

  // find a letter in the tray by id and return the array index
  this.find = function (id)
  {
    for (var i = 0; i < this.letters.length; i += 1)
    {
      if (this.letters[i].id === id) return i;
    }
    return -1;
  };
  //////////////////////////////////////////////////

  // add one specific letter to the tray
  this.add = function (letterObj)
  {
    this.letters.push(letterObj);
    this.render();
  };

  //////////////////////////////////////////////////
  // remove one letter from the tray by id
  this.remove = function (id)
  {
    var index = this.find (id);
    if (index < 0) { return null; }
    var returnVal = this.letters.splice(index, 1);
    if (returnVal > 1) {console.error('ERROR: tray found', returnVal.length, 'letters with same id');}
    return returnVal[0];
  };

  //////////////////////////////////////////////////

  this.showTray = function ()
  {
    trayObject.show();
    this.render();
  };

  this.hideTray = function ()
  {
    trayObject.hide();
  };

  //////////////////////////////////////////////////

  // draw the tray letters
  this.render = function ()
  {
    var that = this;
    trayObject.empty();
    for(var i=0; i<this.letters.length; i++)
    {
      var letterHtml = $(letterTemplate(that.letters[i]));
      trayObject.append(letterHtml);
      // These 'draggable' options are much simpler than those in board.
      letterHtml.draggable(
      {
        zIndex: 100,
        revert: 'invalid',
        containment: 'body',
      });
    }
    trayObject.droppable(
    {
      drop: function (event, ui)
      {
        event.preventDefault();
        $('#dead').empty().removeClass('ui-draggable').removeAttr('id');
        var letterID = ui.helper[0].id;
        $('.ui-draggable-dragging').offset(
        {
          top: $(this).offset().top +12,
          //set height to sit in middle of tray
        });
        var foundLetter = boardRef.retrieveLetter(letterID);
        foundLetter.x = null;
        foundLetter.y = null;
        foundLetter.justPlace = false;
        that.add(foundLetter);
        if(that.letters.length === 7){$('#done-button').val('Pass');}
      },
      greedy: true,
      tolerance: 'touch'
   });
  };

  //////////////////////////////////////////////////

  this.print = function ()
  {
    var output = '';

    for (var i = 0; i < this.letters.length; i += 1)
    {
      output += this.letters[i].character + ' ';
    }
    console.log ('Player ' + this.playerNum +  ' Tray Data: ' + output);
  };

  //////////////////////////////////////////////////

  this.shuffle = function ()
  {
    var temp;  // for storing a letter to do the swap
    var j;     // the random letter

    for (var i = 0; i < this.letters.length; i += 1)
    {
      temp = this.letters[i];
      j = Math.floor (Math.random() * this.letters.length);
      this.letters[i] = this.letters[j];
      this.letters[j] = temp;
    }
  };

};
