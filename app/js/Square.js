'use strict';

module.exports = function Square ()
{
  this.letter = null;  // reference to letter object, not a string
  this.bonus  = null;  // '*', 'DL', '..' etc, displayed on square
  this.class  = null; // example: 'square TW' or 'square blank'
  this.x = null;
  this.y = null;
};
