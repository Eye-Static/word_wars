'use strict';

module.exports = function Square ()
{
  this.letter = null;  // reference to letter object, not a string
  this.bonus = null;  // "st", "dl", "tl", "dw", "tw", ".."
                       // "." is a blank square
  this.class = 'square';
  this.x = null;
  this.y = null;
};
