const path = require('path');
const _ = require('lodash');

process.chdir(__dirname);
const routerPath = path.resolve('../controller');
console.log(routerPath);

var loadmodules = require('../../lib/moduleLoader');
var arrModule = loadmodules(routerPath);


function replaceNull(req, res, next) {
    next();
}
function init(app) {
    var router = app.Router();
    for (var name in arrModule) {
        console.log(name);
        var tmpPath = '';
        if (name == 'index') {
            tmpPath = '/admin';
        } else {
            tmpPath = '/admin/' + name;
        }
        // console.log(tmpPath);
        router.get(tmpPath, _.isFunction(arrModule[name]) || replaceNull);
    }
    return router;
}

exports.init = init;