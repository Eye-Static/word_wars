'use strict';

module.exports = function Square ()
{
  this.letter = null;  // reference to letter object, not a string
  this.bonus  = null;  // '*', 'DL', 'TL', 'DW', 'TW', '..' is a blank square
  this.class = 'square'; //ditto to bonus but '*'' becomes 'start', '..' => 'blank'
  this.x = null;
  this.y = null;
};
