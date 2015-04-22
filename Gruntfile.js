/**
 * Created by mario on 27/02/2015.
 */

var GruntHandler = require("./index.js").GruntHandler;

module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        module_target: {
            options: {

                module: true
            },
            files: ['index.js',]
        },

        watch: {
            scripts: {
                files: ['!images/dontdeleteme.png', 'images/*.*']
            },
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-execute');

    var _800px = {
        width: 800,
        size: "large"
    };

    var _500px = {
        width: 500,
        size: "medium"
    };

    var _200px = {
        width: 200,
        size: "small"
    };

    var _45px = {
        width: 45,
        size: "thumbnail"
    };

    var configs = grunt.file.readJSON('configs.json');

    var _sizesArray = [_800px, _500px, _200px, _45px];

    grunt.event.on('watch', function(action, filepath) {
        if (action === "deleted") {
            console.log("Deleted image");
            return;
        }
        GruntHandler(filepath, _sizesArray, configs);
    });

    grunt.registerTask('default', ['watch']);

    grunt.task.exists('watch');
}




