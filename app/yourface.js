var
  namespace      = require('./modules/namespace'),
  socket         = io.connect();

namespace.init = function( $ ){

  var
    video        = document.getElementById('monitor'),
    capture      = document.getElementById('capture');

  socket.on('list_clients', function(data) {
    for (var i = 0; i < data.clients.length; ++i) {
      var receive = $('<li id="receive_'+ data.clients[i] +'"><img width="160" height="120"/></li>');
      $('#online').append(receive);
    }
  });

  socket.on('join', function(data) {
    var receive = $('<li id="receive_'+ data.client_id +'"><img width="160" height="120"/></li>');
    $('#online').append(receive);
  });

  socket.on('leave', function(data) {
    $('#receive_'+data.client_id).remove();
  });

  // Eat it
  socket.on('capture', function(data) {
    $('#receive_'+data.client_id+' img').attr('src', data.stream_data);
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
  });

};

jQuery( namespace.init );
