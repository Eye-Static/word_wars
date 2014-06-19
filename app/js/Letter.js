	module.exports = function Letter (character, score)
{
  this.character = character;  // the letter on the letter
  this.score = score;          // how many points the letter is worth
  this.justPlaced = false;     // becomes true if the letter was placed this turn
  this.player = null;          // which player played this letter?
};
