var validator = require('./validator');

module.exports = function(game, debug)
{

  $('#shuffle-tray-button').show();
  $('#shuffle-tray-button').click (function ()
  {
    game.players[game.whoseTurn].tray.shuffle();
    game.players[game.whoseTurn].tray.render();
  });

  //////////////////////////////////////////////////

  $('#done-button').show();
  $('#done-button').on('click', function()
  {
    validator.isValid(game);
  });

  //////////////////////////////////////////////////

  $('#turn-in-button').show();
  $('#turn-in-button').on('click', function()
  {
    returnLetters();
    //something more
  });

  //////////////////////////////////////////////////

  $('#return-letters-button').show();
  $('#return-letters-button').click (function ()
  {
    returnLetters();
  });

  //////////////////////////////////////////////////

  var returnLetters = function()
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
    game.board.renderAll();  //use the slow version for now
    game.board.addListeners();
    player.tray.render();
  };

  //////////////////////////////////////////////////
  // DEBUG BUTTONS //
  var debugButtons =
  {
    printGrid: $('#print-grid-button'),
    printTray: $('#print-tray-button'),
    printPlaced: $('#print-placed-button'),
    hideDebug: $('#hide-debug-button')
  };

  var showDebugButtons = function ()
  {
    $('.debug-button').show();

    debugButtons.printGrid.click (function ()
    {
      game.board.printGrid();
    });

    //////////////////////////////////////////////////

    debugButtons.printTray.click (function ()
    {
      for(var i = 0; i < game.players.length; i ++)
      {
        game.players[i].tray.print();
      }
    });

    //////////////////////////////////////////////////

    debugButtons.printPlaced.click (function ()
    {
      game.board.printPlaced();
    });

    //////////////////////////////////////////////////

    debugButtons.hideDebug.click (function ()
    {
      hideDebugButtons();
    });
  };

  //////////////////////////////////////////////////

  var hideDebugButtons = function ()
  {
    $.each(debugButtons, function(name, DOMbutton)
    {
      DOMbutton.hide();
      DOMbutton.off('click');
    });
  };

  if(debug) {showDebugButtons();}
};
