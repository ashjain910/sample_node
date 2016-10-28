var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Deque = require("collections/deque");
// var Map = require("collections/map");
// var map = new Map({});

var deque = new Deque([]);
deque.maxCapacity = 10;
var ct =0 ;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){


  socket.on('chat message', function(msg){
    console.log(msg);
    var obj = JSON.parse(msg);
    console.log("user : " + socket.user);
    var map = {};
    map.inp = obj.inp;
    map.out = obj.out;
    map.user = socket.user;
    // map.set('inp',msg.inp);
    // map.set('out',msg.out);
    // map.set('user',socket.user);
    console.log('message: ' + map);
    deque.push(map);
    if(deque.length == 10) {
    	deque.shift();
    }
    //console.log(deque);
    io.emit('chat message', map);

  });


  socket.on('new user', function () {

  	console.log("new user : " + ct);
  	socket.user = "User " + ct;
  	ct++;


  	if(deque.length > 0) {
  		socket.emit('new_feed',deque);
  	}

  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
