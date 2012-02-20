
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"modules/namespace": function(exports, require, module) {this.Yourface = this.Yourface || {
  module: function() {
    // Internal module cache.
    var modules = {};

    // Create a new module reference scaffold or load an existing module.
    return function(name) {
      // If this module has already been created, return it.
      if (modules[name]) {
        return modules[name];
      }

      // Create a module and save it under this name
      return ( modules[name] = { Views: {} } );
    };
  }(),

  // Keep active application instances namespaced under an app object.
  app: _.extend({}, Backbone.Events)
};

Backbone.Model.prototype.idAttribute = "_id";

module.exports = this.Yourface;
}, "yourface": function(exports, require, module) {var
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
}});
