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

function loop(mod, appRoute, basePath, realPath, sMethod) {
    // 上一层路径(作为下一次循环的基准路径),第一次默认是 / 根目录
    var basePath = basePath || '/',
        realPath = realPath || '/',
        sMethod = sMethod || 'get';

    for (var sP in mod) {
        var arrPathFilterRes = sP.match(PATH_FILTER);

        // 对路径进行过滤,符合要求继续,否则跳出循环
        if (!arrPathFilterRes) {
            // console.error(realPath + ' >> 不符合格式的处理请求');
            // console.log('----------------------------------------------');
            continue;
        }

        // 实际路径与route路径的匹配过滤

        var routePath = basePath,
            nextPath = '';
        // 过滤POST请求
        if (arrPathFilterRes[3]) {
            sMethod = arrPathFilterRes[3];

            if (_.indexOf(REQUEST_METHOD, sMethod.slice(1)) == -1) {
                console.error('请求方法不识别,路由[' + routePath + ']不处理');
                continue;
            }

            if (_.indexOf(REQUEST_METHOD, sMethod.slice(1)) != -1) {
                routePath = routePath.replace(sMethod, '');
                nextPath = sP.replace(sMethod);
                sMethod = sMethod.slice(1);


            } else {
                console.error('请求方法不识别,路由[' + routePath + ']不处理');
                continue;
            }
        } else {
            // 处理掉index、/, 这种作为默认路径情况
            if (sP != 'index') {
                routePath = basePath + '/' + sP;
                nextPath = sP;
            }
        }

        // 判断是否有处理函数
        if (_.isFunction(mod[sP])) {
            //是函数-> 进行逻辑处理

            console.log('【object】' + realPath + sP + '  >> 实际路径->current');
            console.log('【route 】' + routePath + '  >> mount-route');
            console.log('【base  】' + basePath + '  >> 基准路径');
            console.log('----------------------------------------------');

            appRoute[sMethod](routePath, mod[sP]);

            routeCache[sMethod].push(routePath);

        } else if (_.isPlainObject(mod[sP])) {
            //是对象 - > 继续循环
            console.log('【object】' + realPath + sP + ' >> 实际路径->next');
            console.log('【route 】' + basePath + ' >> 基准路径')
            console.log('----------------------------------------------');

            loop(mod[sP], appRoute, basePath + (nextPath || ''), realPath + sP, sMethod);

        } else {
            // 都不符合-> 打印错误信息
            console.error(realPath + '  >> 不匹配,无法识别');
        }
    }
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
    console.log('开始初始化路由表....');

    var router = loop(oMods, appRoute);

    console.log('路由表初始化完成!!!');

    // console.log(routeCache);
    // console.log(oMods);
    return appRoute;
}
