var socket = io();

socket.on('message', function(data)
{
  console.log('incoming message data is', data)
  $('#connection-info').append(data.message);
});
