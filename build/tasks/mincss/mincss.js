/*
 * Grunt Task File
 * ---------------
 *
 * Task: MinCSS 
 * Description: Compress down CSS files cleanly
 * Dependencies: clean-css
 *
 */

task.registerBasicTask("mincss", "Compress down CSS files cleanly", function(data, name) {
  var files = file.expand(data);

  // Minify CSS.
  file.write(name, task.helper('mincss', files));

  // Fail task if errors were logged.
  if (task.hadErrors()) { return false; }

  // Otherwise, print a success message.
  log.writeln("File \"" + name + "\" created.");
});

// ============================================================================
// HELPERS
// ============================================================================

task.registerHelper("mincss", function(files) {
  var cleanCSS = require("clean-css");

  // Minify and combine all CSS 
  return files ? files.map(function(filepath) {
    return cleanCSS.process(file.read(filepath));
  }).join("") : "";
});

