'use strict';
const fs = require('fs');
const path = require('path');

process.chdir(__dirname);

//文件后缀可以是.js,.json.也可以没有
const DEFAULT_PATH_FILTER = /^([^\.].*?)(\.js(on)?)?$/;

//是否检测下级目录(递归)
const DEFAULT_RECURSIVE = true;

//第一次传入(根)目录标记
var ROOT_PATH_FLAG = false;
var ROOT_PATH = '/';

// console.log(module);

function loadModules(sPath) {

    if (!ROOT_PATH_FLAG) {
        ROOT_PATH = sPath;
        ROOT_PATH_FLAG = true;
    }
    var files = fs.readdirSync(sPath);

    var modules = {};

    files.forEach((item)=> {
        var filePath = sPath + '/' + item;

        if (fs.statSync(filePath).isDirectory() && DEFAULT_RECURSIVE) {
            modules[filePath.replace(ROOT_PATH+'/','')] = loadModules(filePath);
        } else {
            var canRead = item.match(DEFAULT_PATH_FILTER);

            if (!canRead) {
                return;
            }
            var route_path = '/'+canRead[1];
            try {
                modules[route_path] = module.require(path.relative(__dirname, filePath));
            } catch (e) {
                console.error(e, '模块' + filePath + '加载失败');
                return;
            }
        }
    });
    return modules;
}

module.exports = loadModules;