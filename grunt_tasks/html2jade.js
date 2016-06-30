/*
 * grunt-html2jade
 * https://github.com/hemanth/grunt-html2jade
 *
 * Copyright (c) 2014 hemanth.hm
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var html2jade = require('html2jade');

    grunt.registerMultiTask('html2jade', '转换 HTML to pug(以前的jade)', function () {
        var options = this.options({
            double: true,
            numeric: false,
            scalate: false,
            nspaces: 4,
            tabs: false,
            donotencode: true,
            bodyless: false,
            noemptypipe:true
        });

        this.files.forEach(function (f) {
            var src = f.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });
            var srcHtml = src.map(function (filepath) {
                return grunt.file.read(filepath);
            });
            var i = 0,
                len = src.length,
                dest = f.dest,
                ext = f.orig.ext;
            ext = ext.indexOf('.') == 0 ? ext : '.' + ext;
            for (; i < len; i++) {
                var fileName = src[i].split('\/').pop().split('.').shift();
                console.log(fileName);
                html2jade.convertHtml(srcHtml[i], options, function (err, pug) {
                    grunt.file.write(dest + '/' + fileName + ext, pug);
                    grunt.log.writeln('File 【"' + (dest + '/' + fileName + ext) + '"】 created.');
                });
            }
        });
    });
};
