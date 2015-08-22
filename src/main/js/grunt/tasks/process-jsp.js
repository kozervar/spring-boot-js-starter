'use strict';

module.exports = function (grunt) {

    var fs = require('fs'),
        path = require('path');

    /**
     * Process JSP file with grunt lodash template.
     */
    grunt.registerMultiTask('process-jsp', 'Process JSP file with grunt lodash template.', function () {
        var that = this;
        var outputFiles = [];
        this.files.forEach(function (f) {
            f.src.filter(function (file) {
                var removeExtension = that.data.removeExtension || path.extname(file);
                var prefix = that.data.filePrefix || '';
                var suffix = that.data.fileSuffix || path.extname(file);
                var basename = path.basename(file, removeExtension);
                var name = prefix + basename + suffix;
                var destination = path.join(path.dirname(file), name);
                outputFiles.push({src: file, dest: destination});
            });
        });
        outputFiles.forEach(function (f) {
            grunt.verbose.writeln('Copying file from ' + f.src + ' to ' + f.dest);
            grunt.file.copy(f.src, f.dest, {
                process: function (contents, srcPath, dstPath) {
                    var opts = {};
                    var data = {};
                    that.data.scopes.forEach(function (s) {
                        if(s.filePath) {
                            data[s.name] = [];
                            grunt.file.expand(s.files).forEach(function(sf){
                                if(s.flatten) {
                                    data[s.name].push(path.normalize(path.join(s.filePath, path.basename(sf))).replace(/\\/g,"/"));
                                } else {
                                    data[s.name].push(path.normalize(path.join(s.filePath, sf)).replace(/\\/g,"/"));
                                }
                            });
                        } else {
                            data[s.name] = grunt.file.expand(s.files);
                        }
                    });

                    if (that.data.delimiters)
                        opts.delimiters = that.data.delimiters;
                    opts.data = data;

                    return grunt.template.process(contents, opts);
                }
            });
        });
    });
};