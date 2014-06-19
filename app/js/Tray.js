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
    
  this.render = function () {
     $("#tray").empty();
     for(var i=0; i<this.letters.length; i++){
     $("#tray").append(letterTemplate(this.letters[i]));
       
    }
   //$("#tray").append('string');
  };
};
