
var socket = io();

var Connection = function()
{
  socket.on('message', function(data)
  {
    console.log(data.message);
  });

  socket.on('gameAppeared', function(data)
  {
    $('#game-lobby').append(
      '<div class="game-listing" id=' + data.gameID + '>' +
      'board: ' + data.board + '<br>' +
      'players: ' + data.numPlayers + '<br>' +
      'created by: ' + (data.creator || 'anon') +
      '</div>');
  });
};

Connection.prototype.sendUserName = function(userName)
{
  socket.emit('submitName',
    {userName: userName, gameStatus: 'waiting', loggedIn: true}
  );
};

Connection.prototype.startGameRequest = function(desiredBoard, desiredPlayers, userName)
{
  var inProgress = (desiredPlayers === 1 ? true : false);

  socket.emit('startGameRequest',
    {board: desiredBoard, numPlayers: desiredPlayers, inProgress: inProgress, creator: userName}
  );
  if(!inProgress)
  {
    $('#connection-info').append('<br><div id ="waiting status">waiting for players</div>');
  }
};

Connection.prototype.joinGame = function(gameID)
{
  console.log('you clicked the game with ID: ' + gameID);
};

module.exports = Connection;
