var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var BoardEnum = Object.freeze({
  BLACK: 0,
  WHITE: 1,
  EMPTY: -1
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// game setup code to execute at start
var team = 0;
var turn = 0;
var connected = 0;

// lines is the number of lines on the board along one axis
var lines = 9;

var gameboard = makeBoard(lines);
// logBoard(gameboard);

io.on('connection', function(socket){

  connected++;
  // handshake contains all init data for game
  io.emit ('handshake', {'lines': lines,
                         'players': connected,
                         'gameboard': gameboard});
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

  // pushes click to all players and logs click in board
  socket.on('boardClick', function(data){
    console.log('X: ' + data.X + ' Y: ' + data.Y + ' team: ' + data.team);
    if (data.team == turn)
    {
      io.emit('drawCircle', {'X': data.X, 'Y': data.Y, 'turn': turn});
      gameboard[data.i][data.j] = turn;
      // logBoard(gameboard);
      swapTurn();
    }
  });

  // pushes board size to all players
  socket.on('boardSizeChange', function(data){
    lines = data.lines;
    io.emit('boardsize', {'lines': lines});
  });

  socket.on('disconnect', function(socket){
    connected--;
    io.emit('playerCount', {'players': connected});
  });
});


http.listen(process.env.PORT || 4000, function(){
  if (process.env.PORT != null)
  {
    console.log("listening on " + process.env.PORT);
  }
  else
  {
    console.log("listening on *.4000");
  }
});

function swapTurn()
{
  if (turn == BoardEnum.BLACK)
  {
    turn = BoardEnum.WHITE;
  }
  else if (turn == BoardEnum.WHITE)
  {
    turn = BoardEnum.BLACK;
  }
  else
  {
    console.log('error: turn variable set incorrectly');
  }

}

// takes an integer for size and returns a 2d array of size x size
function makeBoard(size)
{
  var board = new Array(size);
  for (var i = 0; i < size; i++)
  {
    board[i] = new Array(size);
  }

  // initializes the board to empty
  for (var i = 0; i < size; i++)
  {
    for (var j = 0; j < size; j++)
    {
      board[i][j] = BoardEnum.EMPTY;
      // console.log(board[i][j]);
    }
  }

  return board;
}

function logBoard(board)
{
  for (var i = 0; i < board.length; i++)
  {
    for (var j = 0; j < board.length; j++)
    {
      console.log(board[i][j] + ' ');
    }
    console.log('\n');
  }
}
