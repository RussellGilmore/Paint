var color = '#ff0000';
document.addEventListener("DOMContentLoaded", function() {
  var mouse = {
    click: false,
    move: false,
    pos: {
      x: 0,
      y: 0
    },
    pos_prev: false
  };


  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();

  var width = window.innerWidth;
  var height = window.innerHeight;

  console.log(height);
  var socket = io.connect();

  // set canvas to full browser width/height
  canvas.width = width;
  canvas.height = height;



  // register mouse event handlers
  canvas.onmousedown = function(e) {
    mouse.click = true;
  };
  canvas.onmouseup = function(e) {
    mouse.click = false;
  };

  canvas.onmousemove = function(e) {
    // normalize mouse position to range 0.0 - 1.0
    mouse.pos.x = e.clientX / width;
    mouse.pos.y = (e.clientY - rect.top) / height;
    mouse.move = true;
  };

  // draw line received from server
  socket.on('draw_line', function(data) {
    var line = data.line;
    context.strokeStyle = data.color;
    context.beginPath();
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.stroke();
    context.strokeStyle = color;
  });

  // main loop, running every 25ms
  function mainLoop() {
    // check if the user is drawing
    if (mouse.click && mouse.move && mouse.pos_prev) {
      // send line to to the server
      socket.emit('draw_line', {
        color: color,
        line: [mouse.pos, mouse.pos_prev]
      });
      mouse.move = false;
    }
    mouse.pos_prev = {
      x: mouse.pos.x,
      y: mouse.pos.y
    };
    setTimeout(mainLoop, 25);
  }
  mainLoop();
});
// Color Tool
window.addEventListener("load", startup, false);

function startup() {
  colorWell = document.querySelector("#colorWell");
  colorWell.value = color;
  colorWell.addEventListener("input", updateFirst, false);

  colorWell.select();
}

function updateFirst(event) {
  color = event.target.value;

}
