const path = require('path');
const _ = require('lodash');

process.chdir(__dirname);
var oAllModules = require('../../lib/moduleLoader')(path.resolve('../controller'));
// var require_all = require('../../lib/require-all');
// var oAllModules2 = require_all(routerPath);

function replaceNull(req, res, next) {
    var tmp = {};
    for(var name in oAllModules){
        if(name != '/chat'){
            tmp[name] = oAllModules[name];
        }
    }
    console.log(tmp);;
    res.send(JSON.stringify(tmp['/talk'])).end();
}
function init(app) {
    var router = app.Router();
    var Level_one_route = Object.keys(oAllModules);
    for (var name in oAllModules) {
        if (name.indexOf('/') == 0) {
            router.get(name, _.isFunction(oAllModules[name]['index']) ? oAllModules[name]['index'] : replaceNull);
            for (var subname in oAllModules[name]) {
                router.get(name + '/' + subname, _.isFunction(oAllModules[name][subname]) ? oAllModules[name][subname] : replaceNull);
            }
        }
    }
    router.post('/test',replaceNull);
    return router;
}

exports.init = init;