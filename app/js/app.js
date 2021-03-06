'use strict';
var Game = require('./Game');
var Connection = require('./Connection');
var GameButtons = require('./gameButtons');

$(document).ready(function ()
{
  var userName;
  var game;

  //Change debug to true to remove debug buttons and game auto-start
  var debug = true;

  if(debug){
    // Clicks the new game button
    //this is just for testing, in the final version
    //games are only started with the button
    setTimeout(function(){$('#new-game-button').trigger('click')}, 50);
  }

  var connection = new Connection();

  //////////////////////////////////////////////////

  $('#login-button').on('click', function (e)
  {
    e.preventDefault();
    userName  = $('#user-name').val();
    $('#user-name').empty();
    $('#login-box').text('Logged in as ' + userName);
    connection.sendUserName(userName);
  });

  //////////////////////////////////////////////////

  $('#new-game-button').on('click', function()
  {
    var boardType = $('#board-type').val();
    var gameData  = $('#game-type').val().split(' '); //such as 'local 2'
    var gameType  = gameData[0];
    var playerNum = parseInt (gameData[1]);//Number.parseInt(gameData[1]);

    if(gameType === 'local')
    {
      game = new Game(boardType, playerNum);
      new GameButtons(game, debug);
    }
    else
    {
      //request for more player over internet
      connection.startGameRequest(boardType, playerNum, userName);
    }
  });

  //////////////////////////////////////////////////

  $('#game-lobby').on('click','.game-listing', function()
  {
    var gameID = $(this).context.id;
    connection.joinGame(gameID);
  });

  //////WARNING///VERY HACKY CODE////

  // window.onmousemove = handleMouseMove;
  // setInterval(getMousePosition, 300); // setInterval repeats every X ms
  // var mousePos;
  // function handleMouseMove(event)
  // {
  //   event = event || window.event; // IE-ism
  //   mousePos = {
  //     x: event.clientX,
  //     y: event.clientY
  //   };
  // }
  // function getMousePosition()
  // {
  //   var pos = mousePos;
  //   if (!pos) {
  //     // We haven't seen any movement yet
  //   }
  //   else {
  //     if(pos.y < 450)
  //     {
  //       if($('.ui-draggable')){

  //         $( '.ui-draggable' ).draggable('option', 'scope', 'board');
  //       }
  //     }
  //     else
  //     {
  //       // console.log('y is ' + pos.y);
  //       if($('.ui-draggable')){
  //         $( '.ui-draggable' ).draggable('option', 'scope', 'tray');
  //       }

  //     }
  //   }
  // }
});
