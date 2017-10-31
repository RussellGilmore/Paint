var express = require('express');
var app = express();
var http = require('http');
var io = require('socket.io');
var server = http.createServer(app);
var line_history = [];

io = io.listen(server);
server.listen(8080);
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8080");


io.on('connection', function(socket) {
  // first send the history to the new client
  for (var i in line_history) {
    socket.emit('draw_line', {
      line: line_history[i]
    });
  }
  // add handler for message type "draw_line".
  socket.on('draw_line', function(data) {
    // add received line to history
    line_history.push(data.line);
    // send line to all clients
    io.emit('draw_line', {
      line: data.line
    });
  });
});
