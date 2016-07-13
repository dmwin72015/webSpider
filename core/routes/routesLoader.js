const path = require('path');
const _ = require('lodash');

process.chdir(__dirname);
const routerPath = path.resolve('../controller');
var loadmodules = require('../../lib/moduleLoader');
// var require_all = require('../../lib/require-all');

var arrModule = loadmodules(routerPath);

// var arrModule2 = require_all(routerPath);

function replaceNull(req, res, next) {
    next();
}
function init(app) {
    var router = app.Router();
    for (var name in arrModule) {
        if (name.indexOf('/') == 0) {
            router.get(name, _.isFunction(arrModule[name]['index']) ? arrModule[name]['index'] : replaceNull);
            for (var subname in arrModule[name]) {
                router.get(name + '/' + subname, _.isFunction(arrModule[name][subname]) ? arrModule[name][subname] : replaceNull);
            }
        }
    }
    return router;
}

exports.init = init;