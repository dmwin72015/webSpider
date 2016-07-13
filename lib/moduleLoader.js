'use strict';
const fs = require('fs');
const path = require('path');

process.chdir(__dirname);

//文件后缀可以是.js,.json.也可以没有
const DEFAULT_PATH_FILTER = /^([^\.]\w*)(\.js(on)?)?$/;

//是否检测下级目录(递归)
const DEFAULT_RECURSIVE = true;

const path_resolve = path.resolve;

// console.log(module);

function loadModules(sPath) {
    var files = fs.readdirSync(sPath);

    var modules = {};
    
    files.forEach((item)=> {
        var filePath = sPath + '\\' + item;

        if (fs.statSync(filePath).isDirectory() && DEFAULT_RECURSIVE) {
            modules[filePath] = loadModules(filePath);
        } else {
            var canRead = item.match(DEFAULT_PATH_FILTER);
            if (!canRead) {
                return;
            }
            try {
                modules[item] = require(path_resolve(filePath));
            } catch (e) {
                console.error(e, '模块' + filePath + '加载失败');
                return;
            }
        }
    });
    return modules;
}

module.exports = loadModules;