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
    var bagLetters = game.bag.letters;
    var player = game.players[game.whoseTurn];
    var playerLetters = player.tray.letters;

    var length = playerLetters.length;
    for(var i = 0; i < length; i++)
    {
      bagLetters.push(playerLetters.pop());
    }
    game.bag.shake();

    // This gives letters up to 7 as long as the bag has them
    var letter;
    while(playerLetters.length < 7 && (letter = bagLetters.pop()))
    {
      playerLetters.push(letter);
    }
    player.tray.render();

    $('#transition-dialogue').append(
        '<div>Player ' + (game.whoseTurn+1) +
        ' swapped out ' +
        length + ' letters</div>'
        );

    // Move to next turn
    validator.isValid(game);
  });

  //////////////////////////////////////////////////

  $('#return-letters-button').show();
  $('#return-letters-button').click (function ()
  {
    returnLetters();
    game.board.renderAll();  //use the slow version for now
    game.board.addListeners();
  });

  //////////////////////////////////////////////////

  var returnLetters = function()
  {
    var player = game.players[game.whoseTurn];
    var grid = game.board.grid;
    var letter;

    for(var y = 0; y < grid.length; y ++)
    {
      for(var x = 0; x < grid[y].length; x ++)
      {
        letter = grid[y][x].letter;
        if(letter && letter.justPlaced)
        {
          player.tray.letters.push(letter);
          grid[y][x].letter = null;
        }
      }
    }
    player.tray.render();
    $('#done-button').text('Pass');
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
