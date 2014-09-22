//These are the reference variables.
//Change REF_SQUARE to change square size, and board will scale
//Change GRID_SIZE to change how many squares in each direction.
//Change REF_LINE_WIDTH to change line thickness. Value is normal for 100px square.
var REF_SQUARE = 60;
var GRID_SIZE = 8;
var REF_LINE_WIDTH = 3;
var BOARD_SIZE = (REF_SQUARE * GRID_SIZE) + (REF_SQUARE / 2);

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
    for (var i = 0; i < GRID_SIZE; i++)
      {
        for (var j = 0; j < GRID_SIZE; j++)
        {
          ctx.lineWidth = REF_SQUARE * (3/100);
          ctx.strokeRect( (REF_SQUARE*i)+(REF_SQUARE/4), (REF_SQUARE*j)+(REF_SQUARE/4), REF_SQUARE, REF_SQUARE);
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
  var i = (x - (REF_SQUARE / 4)) / REF_SQUARE;
  var j = (y - (REF_SQUARE / 4)) / REF_SQUARE;

  i = Math.round(i);
  j = Math.round(j);

  console.log("x: " + x + " y: " + y + " i: " + i + " j: " + j);

  var ctx = canvas.getContext("2d");

//draws circle on intersection closest to click
  var centerX = (REF_SQUARE / 4 ) + (i * REF_SQUARE);
  var centerY = (REF_SQUARE / 4 ) + (j * REF_SQUARE);
  var radius  = (REF_SQUARE / 4 );

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
