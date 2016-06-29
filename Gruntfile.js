module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*!<%= pkg.name%>-<%= pkg.version%>-<%= grunt.template.today("yyyy-mm-dd")%>*/\n'
            },
            build: {
                src: 'public/**/*.js',
                dest: 'public/**/*.min.<%= pkg.version%>.js'
            }
        },
        jshint: {
            all: ['app/**/*.js'],
            options: {
                browser: false
            }
        },
        jsdoc: {
            dist: {
                src: ['model/*.js'],
                options: {
                    destination: 'public/doc'
                }
            }
        },
        html2jade: {
            options: {
                double: false,
                tabs: false,
                donotencode:false
            },
            files:{
                src:'public/blog/*.html',
                dest:'views/blog',
                ext:'.pug'
            }
        }
    });


    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 加载包含 "jshint" 任务的插件
    grunt.loadNpmTasks('grunt-contrib-jshint');

    //加载jsdoc 任务插件
    grunt.loadNpmTasks('grunt-jsdoc');

    // 加载html2jade任务插件
    grunt.loadNpmTasks('grunt-html2jade');
    grunt.loadTasks('tasks');


    // 默认被执行的任务列表。
    grunt.registerTask('default', ['html2jade']);
};
