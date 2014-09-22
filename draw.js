//Variable ADJUST THESE
var scale = 0.6;
var grid_size = 8;
var ref_line_width = 3;
var margin_factor = 0.25;
//Static DO NOT CHANGE
var REF_SQUARE = 100;
var SQUARE_SIZE = REF_SQUARE * scale;
var LINE_WIDTH = SQUARE_SIZE * (ref_line_width/REF_SQUARE);
var BOARD_MARGIN = SQUARE_SIZE * margin_factor;
var BOARD_SIZE = (SQUARE_SIZE * grid_size) + (BOARD_MARGIN * 2);

var turn = 0;

document.addEventListener("DOMContentLoaded", draw, false);

function draw()
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
  console.log("turn " + turn);
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

  var ctx = canvas.getContext("2d");

//draws circle on intersection closest to click
  var centerX = BOARD_MARGIN + (i * SQUARE_SIZE);
  var centerY = BOARD_MARGIN + (j * SQUARE_SIZE);
  var radius  = BOARD_MARGIN;

  console.log("centerX: " + centerX + " centerY: " + centerY);

  ctx.beginPath();
  ctx.arc (centerX, centerY, radius, 0, 2 * Math.PI, false);
  if (turn == 0)
  {
    ctx.fillStyle = '#000';
  }
  else
  {
    ctx.fillStyle = '#FFF';
  }
  ctx.fill();
  console.log("drew circle at x: " + centerX + " y: " + centerY);

  turn = (turn + 1) % 2;
}
