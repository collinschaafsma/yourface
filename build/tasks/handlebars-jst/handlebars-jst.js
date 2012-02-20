var handlebars = require("handlebars");

task.registerBasicTask("handlebars-jst", "Compile handlebars templates to JST file", function(data, name){
  // If namespace is specified use that, otherwise fallback
  var namespace = config("jst.namespace") || "JST";
  // If template settings are available use those
  var templateSettings = config("jst.templateSettings") || null;

  // Create JST file.
  var errorcount = fail.errorcount;
  var files = file.expand(data);
  file.write(name, task.helper('handlebars-jst', files, namespace, templateSettings));

  // Fail task if there were errors.
  if (fail.errorcount > errorcount) { return false; }

  // Otherwise, print a success message.
  log.writeln("File \"" + name + "\" created.");
});


task.registerHelper("handlebars-jst", function(files, namespace, templateSettings) {

  namespace = "this['" + namespace + "']";

  // Comes out looking like this["JST"] = this["JST"] || {};
  var contents = namespace + " = " + namespace + " || {};\n\n";

  // Compile the template and get the function source
  contents += files ? files.map(function(filepath) {
    var
      compiled_hbs = handlebars.precompile( file.read(filepath) ),
      nm = filepath.replace('app/templates/', '').replace('.hbs', '');
    return [ '(function(){',
      namespace +' || ('+ namespace +' = {});',
      'this.JST["'+ nm +'"] = function(context) { return HandlebarsTemplates["'+ nm +'"](context); };',
      'this.HandlebarsTemplates || (this.HandlebarsTemplates = {});',
      'this.HandlebarsTemplates["'+ nm +'"] = Handlebars.template('+ compiled_hbs +');',
      '}).call(this);' ].join('\n');
  }).join("\n\n") : "";

  return contents;
});
