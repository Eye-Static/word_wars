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

    //math randomize to pull tiles from the bag up to 7
    while (this.letters.length<7) {
      this.letters.push(bag.removeNext());
    }
  };

  //////////////////////////////////////////////////

  // add one specific letter to the tray
  this.add = function (letter)
  {
  };

  //////////////////////////////////////////////////

  // remove one specific letter from the tray
  this.remove = function (letter)
  {
  };

  this.render = function ()
  {
    $('#tray').empty();

    console.log ('Player 1 Tray:');

    for(var i=0; i<this.letters.length; i++)
    {
      var letterHtml = $(letterTemplate(this.letters[i]));
      var letterData = this.letters[i];
      console.log ('Letter: ' + this.letters[i].character);

      $('#tray').append(letterHtml);
      letterHtml.draggable(
      {
        stop: function ()
        {
          console.log('stopped dragging');
        },
        start: function ()
        {
          var z = letterData.character;
          console.log('started dragging ' + z);//letterData.character);
        },
        revert: 'invalid'
      });
    }
    $('#tray').droppable(
    {
      drop: function (event, ui)
      {
        $('.ui-draggable-dragging').offset({
          top: $(this).offset().top +12,
          //set height to sit in middle of tray
        });
      }
    });
  };
};
