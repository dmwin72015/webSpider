const fs = require('fs');
const path = require('path');
const normalize = path.normalize;
const relative = path.relative;

// process.chdir(__dirname);

//文件后缀可以是.js,.json.也可以没有
const DEFAULT_PATH_FILTER = /^([^\.].*?)(\.js(on)?)?$/;

//是否检测下级目录(递归)
const DEFAULT_RECURSIVE = true;

//第一次传入(根)目录标记
var ROOT_PATH_FLAG = false;
var ROOT_PATH = '/';

// console.log(module);

function loadModules(sPath) {
    var files = fs.readdirSync(normalize(sPath));

    var modules = {};

    files.forEach((item)=> {
        var filePath = normalize(sPath + '/' + item);
        if (fs.statSync(filePath).isDirectory() && DEFAULT_RECURSIVE) {
            modules[item] = loadModules(filePath);
        } else {
            var canRead = item.match(DEFAULT_PATH_FILTER);
            if (!canRead || !canRead[1]) {
                return;
            }
            try {
                //TODO 重名问题解决
                var tmpKey = modules[canRead[1]] ? item : canRead[1];
                modules[tmpKey] = module.require(relative(__dirname, filePath));

            } catch (e) {
                console.error(e);
                console.error('模块' + filePath + '加载失败');
                return;
            }
        }
    });
    return modules;
}

module.exports = loadModules;