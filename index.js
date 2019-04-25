var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket,pseudo){
	socket.on('user', function(pseudo){
		socket.pseudo = pseudo;
		io.emit('user', pseudo);
	})
	
	socket.on('message', function(message){
		io.emit('message', {pseudo: socket.pseudo, message: message});
	});


	socket.on('disconnect', function(pseudo){
		io.emit('disconnect', socket.pseudo);
	});

});



http.listen(port, function(){
	console.log('listening on ${ port }');
});