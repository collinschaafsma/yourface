/*global _: true */

var
  hbs          = require('hbs'),
  express      = require('express'),
  routes       = require('./lib/routes'),
  socket       = require('socket.io'),
  app          = module.exports = express.createServer(),
  io           = socket.listen(app);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.logger('dev'));
  app.use(express.session({ secret: 'yourface' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/assets'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
  app.helpers({ production: true });
});

// Routes
app.get( '/', routes.index );

// Socket.io
io.sockets.on('connection', function(socket) {
  var clients = io.sockets.clients();
  var client_ids = [];
  for (var i = 0; i < clients.length; ++i) {
    client_ids[i] = clients[i].id;
  }

  socket.emit('list_clients', { clients: client_ids })
  socket.broadcast.emit('join', { client_id: socket.id });
  socket.on('capture', function(data) {
    io.sockets.emit('capture', { stream_data: data, client_id: socket.id });
  });

  socket.on('disconnect', function () {
    io.sockets.emit('leave', { client_id: socket.id });
  });

});

app.listen( process.env.PORT || 3000 );

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
