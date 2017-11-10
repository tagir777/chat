var PORT = 8008;

var options = {
//    'log level': 0
};

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, options);
var redis  = require('redis-js');
server.listen(PORT);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	
	var id = socket.id;
	var value = redis.get(id);
	
	if(value == null){
		redis.set('key', id);
		socket.emit('Connect');
		socket.join(id);		
	}else{
		redis.set(value, id);
		redis.set(id, value);
		socket.join(value);
		socket.emit('userName', value);
		socket.broadcast.to(value).emit('newUser');
		redis.del('key');
	}

	socket.on('message', function(mes){
		var val = redis.get(id);
		socket.emit('messageToMe', mes, id);
		socket.broadcast.to(val).emit('messageToClients', mes, id);

	});

	socket.on('disconnect', function(){
		if(value !== id){
			
			socket.broadcast.to(id).emit('userDel');
			socket.leave(id);
			redis.del(id);
		}else{
			socket.broadcast.to(id).emit('userDel');
			socket.leave(id);
			redis.del(id);
		}		
	});
});

