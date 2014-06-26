module.exports = function(game)
{

  $('#shuffle-tray-button').show();
  $('#shuffle-tray-button').click (function ()
  {
    game.players[0].tray.shuffle();
    game.players[0].tray.render();
    //game.board.render (game.players[game.turn]);
    game.board.addListeners (game.players);
  });

  //////////////////////////////////////////////////
  $('#done-button').show();
  $('#done-button').on('click', function()
  {
    if (game.isValid())
    {
      game.finishTurn();
      game.nextTurn();
    }
    else 
    {
      alert ("Words must be placed in a solid straight line.");
    } 
  })

  //////////////////////////////////////////////////
  $('#return-letters-button').show();
  $('#return-letters-button').click (function ()
  {
    var player    = game.players[game.whoseTurn];
    var boardGrid = game.board.grid;
    var letter;

    for(var y = 0; y < boardGrid.length; y ++)
    {
      for(var x = 0; x < boardGrid[y].length; x ++)
      {
        letter = boardGrid[y][x].letter;
        if(letter && letter.justPlaced)
        {
          player.tray.letters.push(letter);
          boardGrid[y][x].letter = null;
        }
      }
    }
    game.board.render();
    player.tray.render();
    game.board.addListeners(game.players);
  });

  //////////////////////////////////////////////////
  // DEBUG BUTTONS //

  $('#print-grid-button').click (function ()
  {
    game.board.printGrid();
  });

  //////////////////////////////////////////////////

  $('#print-tray-button').click (function ()
  {
    for(var i = 0; i < game.players.length; i ++)
    {
      game.players[i].tray.print();
    }
  });
};
