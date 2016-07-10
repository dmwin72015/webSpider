/**
 * Created by mjj on 16/7/10.
 */
var requireDirectory = require('require-directory');

var routes = requireDirectory(module,'../core/routes');

console.dir(routes.article);
