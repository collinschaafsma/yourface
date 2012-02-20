var
  namespace      = require('./modules/namespace'),
  socket         = io.connect();

namespace.init = function( $ ){

  var
    video        = document.getElementById('monitor'),
    capture      = document.getElementById('capture'),
    receive      = document.getElementById('receive');

    socket.emit('ping', { yo: 'talk to me' });

    // Eat it
    socket.on('capture', function(data) {
      receive.src = data;
      console.log("eat it");
    });

    // Pull it
    navigator.webkitGetUserMedia('video audio', function(stream) {
      video.src = webkitURL.createObjectURL(stream);
      video.addEventListener('error', function () {
        stream.stop();
      });
    });

    // Push it
    $(video).on('timeupdate', function(e) {
      var captureCanvas = capture.getContext('2d');
      captureCanvas.drawImage(video, 80, 0, 160, 120, 0, 0, 160, 120);
      socket.emit('capture', capture.toDataURL());
      console.log("push it");
    });

};

jQuery( namespace.init );
