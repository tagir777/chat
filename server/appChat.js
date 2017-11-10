var PORT = 8008;

var options = {
//    'log level': 0
};

var express = require('express');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, options);
var redis  = require('redis-js');
var connect = require('connect');
server.listen(PORT);

var session = require('express-session');
var redisStore = require('connect-redis')(session);

app.use(session({
    secret: 'ssshhhhh',
	key: 'express.sid',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379}),
    saveUninitialized: false,
    resave: false
}));

app.get('/', function(req, res, next) {
	console.log("aaa");
    req.session.number = req.session.number + 1 || 1;
    console.log(req.session.number);
});

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
	console.log("aaa");
});

io.set('authorization', function(handshake, callback) {
    handshake.cookies = cookie.parse(handshake.headers.cookie || '');
	console.log(handshake.headers.cookie || '');
	console.log(handshake.headers);
    var sidCookie = handshake.cookies[session.key];
	console.log(handshake.cookies);
	console.log('sidCookie');
    var sid = cookieParser.signedCookies(handshake.cookies, session.secret);
	console.log(sid);
    if(!sid){
        console.log(sid);
    }
    redis.get('sess:'+sid, function(err, data) {
        if(err){
            log.error('io.authorization -> ',err);
            return;
        }
        if(data){
            handshake.user = jsonParse(data);
            callback(null, true);
        }
    });
});

io.on('connection', function(socket){
	
	console.log(socket.handshake);
	
	var id = socket.id;
	var value = redis.get('key');
	
	if(value == null){
		redis.set('key', id);
		socket.emit('Connect');
	}else{
		redis.set(value, id);
		redis.set(id, value);
		socket.emit('userName', value);
		io.sockets.sockets[value].emit('newUser', id);
		redis.del('key');
	}

	socket.on('message', function(mes){
		var val = redis.get(id);
		socket.emit('messageToMe', mes, id);
		if(val !== null){
			io.sockets.sockets[val].emit('messageToClients', mes, id);
		}
	});

	socket.on('disconnect', function(){
		var val = redis.get(id);
		if(val !== null){
			io.sockets.sockets[val].emit('userDel');
			redis.del(val);
		}else{
			redis.del(val);
			if(value == id){
				io.sockets.sockets[val].emit('userDel');
				redis.del('key');
			}
		}		
	});
});

