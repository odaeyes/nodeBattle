var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket, pseudo){

/*<<<<<<< Updated upstream
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

=======*/
 	var loggedUser; // Utilisateur connecté a la socket
 	var roomId = socket.id;
	var randomNumb = Math.floor(Math.random()*Math.floor(30));
 	var saloon = {
      	'id': roomId,
      	'nom': "room "+randomNumb
      };
	socket.emit('room-service', saloon);
  /**
   * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
   */
  socket.on('disconnect', function () {
    if (loggedUser !== undefined) {
      console.log('user disconnected : ' + loggedUser.username);
      var serviceMessage = {
        text: 'User "' + loggedUser.username + '" disconnected',
        type: 'logout'
      };
      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

  /**
   * Connexion d'un utilisateur via le formulaire :
   *  - sauvegarde du user
   *  - broadcast d'un 'service-message'
   */
  socket.on('user-login', function (user) {
    loggedUser = user;
    
    /*console.log(userId);*/
    if (loggedUser !== undefined) {
      var serviceMessage = {
        text: 'User "' + loggedUser.username + '" logged in',
        type: 'login'
      };
      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

  /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  socket.on('chat-message', function (message) {
    message.username = loggedUser.username;
    
    io.emit('chat-message', message);
    console.log('Message de : ' + loggedUser.username);
    

  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});