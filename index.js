var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket, pseudo){

	socket.on('user', function(pseudo){
		socket.pseudo = pseudo;
		io.emit('user', pseudo);
		// socket.emit('con', pseudo);
	})
	socket.on('disconnect', function(pseudo){

		io.emit('disconnect', socket.pseudo);
	});

  socket.on('message', function(message){
    io.emit('message', {pseudo: socket.pseudo, message: message});

  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});