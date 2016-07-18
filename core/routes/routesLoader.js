'use strict';
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const PATH_FILTER = /(^\w+(\/:\w+)?)(\|\w+)?$/;
const REQUEST_METHOD = ['get', 'post', 'head', 'delete'];


// const modLoader = require(path.join(__dirname,'../../lib/moduleLoader'));
const modLoader = require('../../lib/moduleLoader');

var routeCache = {
    get: [],
    post: []
};
var log = false;

function loop(mod, appRoute, basePath, realPath, sMethod) {
    // 上一层路径(作为下一次循环的基准路径),第一次默认是 / 根目录
    var basePath = basePath || '/',
        realPath = realPath || '',
        baseMethod = sMethod;

    for (var sP in mod) {
        var arrPathFilterRes = sP.match(PATH_FILTER);

        // 对路径进行过滤,符合要求继续,否则跳出循环
        if (!arrPathFilterRes) {
            // console.error(realPath + ' >> 不符合格式的处理请求');
            // console.log('----------------------------------------------');
            continue;
        }

        // 实际路径与route路径的匹配过滤
        var currRealPath = realPath + '/' + sP,
            currPath = sP + '/',
            currMethod = 'get';

        // 过滤请求:
        /**
            1.优先使用当前设置的请求类型。
            2.当前无类型则使用上一次的。
            3.上一次无类型，则使用get
        */

        if (baseMethod) {
            currMethod = baseMethod;
        }

        //TODO 有bug，没有添加验证判断
        if (/^index(\/:\w+)?$/.test(arrPathFilterRes[1])) {
            currPath = basePath + currPath.replace('index/', '');
        } else {
            currPath = basePath + currPath;
        }

        if (arrPathFilterRes[3]) {
            currMethod = arrPathFilterRes[3];
            if (_.indexOf(REQUEST_METHOD, currMethod.slice(1)) == -1) {
                console.error('请求方法不识别,路由[' + currRealPath + ']不处理');
                continue;
            }
            currPath = currPath.replace(currMethod, '');
            currMethod = currMethod.slice(1);
        }
        
        // 判断是否有处理函数
        if (_.isFunction(mod[sP])) {
            //是函数-> 进行逻辑处理
            if (log) {
                console.log('【object】' + currRealPath + '  >> 实际路径->current');
                console.log('【route 】' + currPath + '  >> mount-route');
                console.log('【base  】' + basePath + '  >> 基准路径');
                console.log('----------------------------------------------');
            }

            appRoute[currMethod](currPath, mod[sP]);

            routeCache[currMethod].push(currPath);

        } else if (_.isPlainObject(mod[sP])) {
            //是对象 - > 继续循环
            if (log) {
                console.log('【object】' + currRealPath + ' >> 实际路径->next');
                console.log('【route 】' + basePath + ' >> 基准路径')
                console.log('----------------------------------------------');
            }

            loop(mod[sP], appRoute, currPath, currRealPath, currMethod);

        } else {
            // 都不符合-> 打印错误信息
            console.error('[ error:', new Date().toLocaleString(), ' ] >> 路由：' + realPath + '  >> 类型不是对象或方法，无法匹配、识别。');
        }
    }
    return appRoute;
}


// TODO 添加日志功能
function writeLog(str) {

}
// 格式化日期格式
function logNameFormat(oDate, format) {
    format = format || 'yyyy-mm-dd';
    var oDate = new Date;
    var year = oDate.getFullYear();
    var month = oDate.getMonth() + 1;
    var day = oDate.getDate();

    return format.replace(/y{4}/, year).replace(/m{2}/, month).replace(/d{2}/, day);
}

module.exports = (appRoute) => {
    var oMods = modLoader(path.join(__dirname, '../controller'));

    // console.log(oMods);
    console.log('*********************************************');
    console.log('[ info :', new Date().toLocaleString(), ' ] >> 开始初始化路由表[', new Date().toLocaleString(), ']');

    var router = loop(oMods, appRoute);

    console.log('[ info :', new Date().toLocaleString(), ' ] >> 路由表初始化完成');
    console.log('[ info :', new Date().toLocaleString(), ' ] >> 路由表为：');
    console.log(routeCache);

    console.log('*********************************************\n');

    return appRoute;
}
