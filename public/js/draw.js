var socket = io();

//Variable ADJUST THESE
var scale = 0.6; //scale factor for board size
var grid_size = 8; //# of squares.
var ref_line_width = 3; //width of the lines (gets scaled)
var margin_factor = 0.25; //width of margin as percent of square
//Static DO NOT CHANGE
var REF_SQUARE = 100;
var SQUARE_SIZE = REF_SQUARE * scale;
var LINE_WIDTH = SQUARE_SIZE * (ref_line_width/REF_SQUARE);
var BOARD_MARGIN = SQUARE_SIZE * margin_factor;
var BOARD_SIZE = (SQUARE_SIZE * grid_size) + (BOARD_MARGIN * 2);

var team = 2;
document.addEventListener("DOMContentLoaded", drawBoard, false);

socket.on('team', function(data){
  team = data.team;
  document.getElementById('teamNum').innerHTML += team;
});

socket.on('drawCircle', function(data){
  drawCircle(data.X, data.Y,data.turn);
  console.log('received X: ' + data.X + " Y: " + data.Y);
});

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
    for (var i = 0; i < grid_size; i++)
      {
        for (var j = 0; j < grid_size; j++)
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

  var x = event.x;
  var y = event.y;

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

//see notebook page 18 for explanation of formula.
  var i = (x - BOARD_MARGIN) / SQUARE_SIZE;
  var j = (y - BOARD_MARGIN) / SQUARE_SIZE;

  i = Math.round(i);
  j = Math.round(j);

  console.log("x: " + x + " y: " + y + " i: " + i + " j: " + j);

  var centerX = BOARD_MARGIN + (i * SQUARE_SIZE);
  var centerY = BOARD_MARGIN + (j * SQUARE_SIZE);

  console.log("centerX: " + centerX + " centerY: " + centerY);

  socket.emit('boardClick', {'X': centerX, 'Y': centerY});

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

  swapTurn();
}
