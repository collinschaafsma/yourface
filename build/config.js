// This is the main Backbone Boilerplate build configuration file.
//
// This is a JavaScript file, you can define any functions you would like in
// here.
config.init({

  lint: {
    files: ["build/config.js", "app/**/*.js", "lib/**/*.js", "routes/*.js", "app.js"]
  },

  concat: {

    // The core library files
    "assets/js/src/libs.js": [
      "assets/js/libs/underscore.js",
      "assets/js/libs/backbone.js",
      "assets/js/libs/jquery.quicksearch.js"
    ]

  },

  stitch: {
    "assets/js/src/app.js": {
      paths: [ "app" ]
    }
  },

  "handlebars-jst": {
    "assets/js/src/templates.js": ["app/templates/**/*.hbs"]
  },

  min: {
    //"assets/js/src/templates.js": ["assets/js/src/templates.js"],
    "assets/js/src/libs.js": ["assets/js/src/libs.js"],
    "assets/js/src/app.js": ["assets/js/src/app.js"]
  },

  watch: {
    files: ["assets/**/*", "app/**/*"],
    tasks: "concat stitch",

    min: {
      files: ["assets/**/*", "app/**/*"],
      tasks: "default"
    },

    stitch: {
      files: ["app/modules/**/*"],
      tasks: "lint:files stitch"
    }
  },

  clean: {
    folder: "assets/js/src/"
  }

});

// Run the following tasks...
task.registerTask("default", "clean stitch concat min");
