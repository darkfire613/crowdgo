var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var team = 0;
var turn = 0;

io.on('connection', function(socket){
  console.log('user connected to team ' + team);
  //emit team to player
  io.emit('team', {'team': team});
  //flip team
  team = (team + 1) % 2;

  socket.on('boardClick', function(data){
    console.log('X: ' + data.X + ' Y: ' + data.Y);
    io.emit('drawCircle', {'X': data.X, 'Y': data.Y, 'turn': turn});
    swapTurn();
  });
});


http.listen(process.env.PORT || 4000, function(){
  console.log("listening on " + process.env.PORT);
});

function swapTurn()
{
  turn = (turn + 1) % 2;
}
