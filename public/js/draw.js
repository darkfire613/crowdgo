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
  updateBoard();
  drawBoard();


});

socket.on('team', function(data){
  team = data.team;
  document.getElementById('teamNum').innerHTML += team;
  turn = data.turn;
  document.getElementById('turnNum').innerHTML = turn;
});

socket.on('drawCircle', function(data){
  drawCircle(data.X, data.Y,data.turn);
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

  canvas.addEventListener("mousedown", getPosition, false);
}

function getPosition(event)
{
  var canvas = document.getElementById("canvas");
//gets x and y position of click
  var x = event.x;
  var y = event.y;


  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

//see notebook page 18 for explanation of formula.
  var i = (x - BOARD_MARGIN) / SQUARE_SIZE;
  var j = (y - BOARD_MARGIN) / SQUARE_SIZE;

//i and j are the value of the intersection you clicked on
  i = Math.round(i);
  j = Math.round(j);

  console.log("x: " + x + " y: " + y + " i: " + i + " j: " + j);


  vertexCoords(i,j);
}

function vertexCoords(i,j)
{
  var centerX = BOARD_MARGIN + (i * SQUARE_SIZE);
  var centerY = BOARD_MARGIN + (j * SQUARE_SIZE);

  console.log("centerX: " + centerX + " centerY: " + centerY);

// tells the server where clicked
  socket.emit('boardClick', {'X': centerX, 'Y': centerY, 'team': team});
}

function drawCircle(x,y,turn)
{
//sets context of canvas
  var ctx = canvas.getContext("2d");
  var radius  = BOARD_MARGIN;

//sets center of circle to provided x,y args
  ctx.beginPath();
//draws a circle
  ctx.arc (x, y, radius, 0, 2 * Math.PI, false);
//alternates color of circle
  if (turn == 0)
  {
    ctx.fillStyle = '#000';
  }
  else
  {
    ctx.fillStyle = '#FFF';
  }
  ctx.fill();
  console.log("drew circle at x: " + x + " y: " + y);
  changeTurn();

}

function changeTurn()
{
  turn = (turn + 1) % 2;
  document.getElementById('turnNum').innerHTML = turn;
}
