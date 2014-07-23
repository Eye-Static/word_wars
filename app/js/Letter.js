module.exports = function Letter (character, score, id)
{
  this.character = character;  // the letter on the letter
  this.score = score;          // how many points the letter is worth
  this.justPlaced = false;     // becomes true if the letter was placed this turn
  this.x = null;
  this.y = null;
  // this.locked = false;         // letter is immobile
  // this.player = null;          // which player played this letter?
  this.id = id;                // a unique identifier (string) - id21, id22, etc.
  this.definition = null;
};
