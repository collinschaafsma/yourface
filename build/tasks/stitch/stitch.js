var stitch = require('stitch');
var path = require('path');

// ============================================================================
// TASKS
// ============================================================================

task.registerBasicTask("stitch", "Compile common.js modules with stitch", function( data, name ){

  data.paths = data.paths.map(function(dir){
    return "./" + dir;
  });

  stitch.createPackage( data ).compile(function( error, src ){
    var errorcount = fail.errorcount;

    if( error ){
      return log.error( error );
    }

    file.write( name, src );

    // Fail task if there were errors.
    if (fail.errorcount > errorcount) { return false; }

    log.writeln("File \"" + name + "\" created.");
  });

});
