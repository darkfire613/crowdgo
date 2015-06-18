var socket = io();

//Variable ADJUST THESE
var scale = 0.6; //scale factor for board size
var lines = 9; //# of lines, 9 is default but will get overwritten by server
var ref_line_width = 3; //width of the lines (gets scaled)
var margin_factor = 0.25; //width of margin as percent of square
//Static DO NOT CHANGE
var GRID_SIZE;
var REF_SQUARE;
var SQUARE_SIZE;
var LINE_WIDTH;
var BOARD_MARGIN;
var BOARD_SIZE;

var BoardEnum = Object.freeze({
  BLACK: 0,
  WHITE: 1,
  EMPTY: -1
});

// will never be 2, if you see 2 it means server didnt init
var team = 2;
var turn = 2;

//draws board when the page loads
// document.addEventListener("DOMContentLoaded", drawBoard, false);
// console.log('Board drawn');


// socket listeners
socket.on ('handshake', function(data){
  document.getElementById('players').innerHTML = data.players;
  lines = data.lines;
  console.log('handshake received.');
  console.log('number of players: ' + data.players);
  console.log('number of lines: ' + data.lines);
  console.log('local lines: ' + lines);
  // draws board on socket handshake
  drawBoard();
  drawInitState(data.gameboard);
});

socket.on('boardsize', function(data){
  lines = data.lines;
  drawBoard();
});

socket.on('team', function(data){
  team = data.team;
  document.getElementById('teamNum').innerHTML += team;
  turn = data.turn;
  document.getElementById('turnNum').innerHTML = turn;
});

socket.on('drawCircle', function(data){
  drawCircle(data.X, data.Y, data.turn);
  swapTurn();
  console.log('received X: ' + data.X + " Y: " + data.Y);
});


// covered by handshake
/*
socket.on('playerCount', function(data){
  document.getElementById('players').innerHTML = data.players;
});

socket.on('boardsize', function(data){
  lines = data.lines;
  console.log('received lines: ' + data.lines);
  console.log('updating lines: ' + lines);
});
*/

//functions

// updates the data used to draw the board
function updateBoard()
{
  console.log('updating board');
  GRID_SIZE = lines - 1;
  REF_SQUARE = 100;
  SQUARE_SIZE = REF_SQUARE * scale;
  LINE_WIDTH = SQUARE_SIZE * (ref_line_width/REF_SQUARE);
  BOARD_MARGIN = SQUARE_SIZE * margin_factor;
  BOARD_SIZE = (SQUARE_SIZE * GRID_SIZE) + (BOARD_MARGIN * 2);
}

function drawBoard()
{
  updateBoard();
  var canvas = document.getElementById("canvas");
//sets canvas size to board size
  canvas.width = BOARD_SIZE;
  canvas.height = BOARD_SIZE;
  console.log("width: " + canvas.width, " height: " + canvas.height);
//if browser supports canvas


  if (canvas.getContext)
  {
//ctx is the context, 2d calls the 2d API
    var ctx = canvas.getContext("2d");
    ctx.translate(0.5, 0.5);

//draws rectangle for board filling the canvas
    ctx.fillStyle = "rgb(238, 221, 145)";
    ctx.fillRect (0, 0, BOARD_SIZE, BOARD_SIZE);

//draws the grid with double for loops
    for (var i = 0; i < GRID_SIZE; i++)
      {
        for (var j = 0; j < GRID_SIZE; j++)
        {
          ctx.lineWidth = LINE_WIDTH;
          ctx.strokeRect( (SQUARE_SIZE*i)+(SQUARE_SIZE/4), (SQUARE_SIZE*j)+(SQUARE_SIZE/4), SQUARE_SIZE, SQUARE_SIZE);
        }
      }
      console.log("drew board");
  }

  /*TODO: needs to call a draw function which itself has a more
    general getPosition function called within it. Also, vertexCoords
    needs to have its socket.emit part separated to another function that gets called secondarily to make the function more universally
    usable, for drawing the initial board position for example. Rework
    the synergy between these three functions to make a more
    streamlined drawing workflow
  */
  canvas.addEventListener("mousedown", onClick, false);
}

function onClick(event)
{
  console.log('onClick:');

  // x and y coords of the click
  var x = event.x;
  var y = event.y;

  // gets the board position of the intersection closest to click
  var gridPos = getPosition(x,y);
  var i = gridPos.i;
  var j = gridPos.j;
  console.log('i: ' + i + ' j: ' + j);

  // takes the board position and calculates x and y coordinates
  var coords = vertexCoords(i,j);

  // sends the data to the server
  sendCoords(coords.centerX, coords.centerY, i, j, team);

  // server then sends the draw command to everyone
}

function getPosition(x,y)
{
  var canvas = document.getElementById("canvas");

// adjust for canvas offset
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

// see notebook page 18 for explanation of formula.
  var i = (x - BOARD_MARGIN) / SQUARE_SIZE;
  var j = (y - BOARD_MARGIN) / SQUARE_SIZE;

// i and j are the value of the intersection you clicked on
  i = Math.round(i);
  j = Math.round(j);

  console.log("x: " + x + " y: " + y + " i: " + i + " j: " + j);

  return {'i': i, 'j': j};
}

// returns the vertex pixel coords based on grid coords
function vertexCoords(i,j)
{
  var centerX = BOARD_MARGIN + (i * SQUARE_SIZE);
  var centerY = BOARD_MARGIN + (j * SQUARE_SIZE);

  console.log("centerX: " + centerX + " centerY: " + centerY);

// tells the server where clicked
// X and Y are the pixel coordinates. i and j are the board coordinates
  return {'centerX': centerX, 'centerY': centerY};
}

function sendCoords(x,y,i,j,team)
{
  console.log('sending coords to server');
  socket.emit('boardClick', {'X': x, 'Y': y, 'i': i, 'j': j, 'team': team});
}

function drawCircle(x,y,color)
{
//sets context of canvas
  var ctx = canvas.getContext("2d");
  var radius  = BOARD_MARGIN;

//sets center of circle to provided x,y args
  ctx.beginPath();
//draws a circle
  ctx.arc (x, y, radius, 0, 2 * Math.PI, false);
//alternates color of circle
  if (color == BoardEnum.BLACK)
  {
    ctx.fillStyle = '#000';
  }
  else if (color == BoardEnum.WHITE)
  {
    ctx.fillStyle = '#FFF';
  }
  ctx.fill();
  console.log("drew circle at x: " + x + " y: " + y);
}

function drawInitState(gameboard)
{
  console.log('initial state setup:')
  for (var i = 0; i < gameboard.length; i++)
  {
    for (var j = 0; j < gameboard.length; j++)
    {
      if (gameboard[i][j] != BoardEnum.EMPTY)
      {
        console.log('drawing ' + gameboard[i][j] + ' at ' + i + ',' + j);
        coords = vertexCoords(i,j);
        drawCircle(coords.centerX, coords.centerY, gameboard[i][j]);
      }
    }
  }
}

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
  document.getElementById('turnNum').innerHTML = turn;
}

function incBoard()
{
  if (lines < 19)
  {
    lines++;
    socket.emit('boardSizeChange', {'lines': lines});
    console.log('increased board to ' + lines);
    drawBoard();
  }
}

function decBoard()
{
  if (lines > 2)
  {
    lines--;
    socket.emit('boardSizeChange', {'lines': lines});
    console.log('decrased board to ' + lines);
    drawBoard();
  }

}
