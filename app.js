var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// game setup code to execute at start
var team = 0;
var turn = 0;
var connected = 0;

// lines is the number of lines on the board along one axis
var lines = 3;

// var gameboard = makeBoard ()



io.on('connection', function(socket){

  connected++;
  // handshake contains all init data for game
  io.emit ('handshake', {'lines': lines,
                         'players': connected});
  // send player board size
  // io.emit('boardsize', {'lines': lines});
  // update player count
  // io.emit('playerCount', {'players': connected});
  // get newest user's ID for team assignment
  var newUsrID = socket.id;
  console.log('user ' + newUsrID + 'connected to team ' + team);
  // emit team to player
  io.sockets.connected[newUsrID].emit('team', {'team': team, 'turn': turn});
  // io.emit('team', {'team': team});
  // flip team
  team = (team + 1) % 2;

  socket.on('boardClick', function(data){
    console.log('X: ' + data.X + ' Y: ' + data.Y);
    if (data.team == turn)
    {
      io.emit('drawCircle', {'X': data.X, 'Y': data.Y, 'turn': turn});
      swapTurn();
    }
  });
  socket.on('disconnect', function(socket){
    connected--;
    io.emit('playerCount', {'players': connected});
  });
});


http.listen(process.env.PORT || 4000, function(){
  console.log("listening on " + process.env.PORT);
});

function swapTurn()
{
  turn = (turn + 1) % 2;
}

// takes an integer for size and returns a 2d array of size x size
function makeBoard(size)
{
  var board = new Array(size);
  for (var i = 0; i < size; i++)
  {
    board[i] = new Array(size);
  }

  return board;
}
