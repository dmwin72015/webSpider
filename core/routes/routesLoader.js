'use strict';
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const PATH_FILTER = /(^\w+(\/:\w+)?)(\|\w+)?$/;
const REQUEST_METHOD = ['get', 'post', 'head', 'delete'];


// const modLoader = require(path.join(__dirname,'../../lib/moduleLoader'));
const modLoader = require('../../lib/moduleLoader');

var num = 0;

function loop(mod, appRoute, basePath, realPath) {
    // 上一层路径(作为下一次循环的基准路径),第一次默认是 / 根目录
    basePath = basePath || '';
    realPath = realPath || '';
    console.log('[' + basePath + ']');
    for (var sP in mod) {
        var arrPathFilterRes = sP.match(PATH_FILTER);
        var realPath = realPath + '/' + sP;

        // 对路径进行过滤,符合要求继续,否则跳出循环
        if (!arrPathFilterRes) {
            // console.error(realPath + ' >> 不符合格式的处理请求');
            // console.log('----------------------------------------------');
            continue;
        }

        // 实际路径与route路径的匹配过滤
        // 处理掉index、/, 这种作为默认路径情况
        var routePath = basePath,
            sMethod = 'get';

        if (sP != 'index') {
            basePath = routePath = basePath + '/' + sP;
            // 过滤post请求
            if (arrPathFilterRes[3]) {
                sMethod = arrPathFilterRes[3];
                if (_.indexOf(REQUEST_METHOD, sMethod.slice(1)) != -1) {
                    basePath = routePath = routePath.replace(sMethod, '');
                    sMethod = sMethod.slice(1);
                } else {
                    console.error('请求参数不识别,此路由[' + realPath + ']不做处理');
                    continue;
                }
            }

        }

        // 判断是否有处理函数
        if (_.isFunction(mod[sP])) {
            //是函数-> 进行逻辑处理
            console.log('【object】' + realPath + '  >> 这是对象中路径');
            console.log('【route 】' + routePath + '  >> 初始化');
            console.log('----------------------------------------------');

            appRoute[sMethod](routePath, mod[sP]);

        } else if (_.isPlainObject(mod[sP])) {
            //是对象 - > 继续循环
            console.log('【object】' + realPath + ' >> 这是对象中路径,无处理函数,开始下次循环');
            console.log('【route 】' + routePath + ' >> 基准路径')
            console.log('----------------------------------------------');

            loop(mod[sP], appRoute, basePath, realPath);

        } else {
            // 都不符合-> 打印错误信息
            console.error(realPath + '  >> 这是不是一个function 或者object,无法识别');
        }
    }
}


function initRoute(app) {

    var oMods = modLoader(path.join(__dirname, '../controller'));
    var logger = {
        get: [],
        post: []
    };
    var testObject = {
        get: function(p, m) {
            logger.get.push({
                p: p,
                m: m
            })
        },
        post: function(p, m) {
            logger.post.push({
                p: p,
                m: m
            })
        }
    };

    // console.log(oMods);

    loop(oMods, testObject);


    console.log(logger);

    /*
    var str = 'getArtName/:id|post';

    var str2 = 'getaaaa';

    var str3 = 'getArtName/:ad|post|asad';

    var str4 = 'getArtName/:id';

    var str5 = 'str4|post';
    // var reg = /^\w+(\|\w+)?$/;
    var reg = /^\w+(\/:\w+)?(\|\w+)?$/

    console.dir(str5.match(reg));
    
    return str;
    */
}



function writeLog(str) {



}

function logNameFormat(oDate, format) {
    format = format || 'yyyy-mm-dd';
    var oDate = new Date;
    var year = oDate.getFullYear();
    var month = oDate.getMonth() + 1;
    var day = oDate.getDate();

    return format.replace(/y{4}/, year).replace(/m{2}/, month).replace(/d{2}/, day);
}

exports.init = initRoute();
