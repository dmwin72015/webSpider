/**
 * Created by yxp on 2016/6/23.
 */
const agent = require('../util/myAgent');
const myEmit = require('../util/myEmitter')['emitter'];
const addEvent = require('../util/myEmitter').addEvent;
const keys = ['mov_cnName', 'mov_enName', 'mov_year', 'mov_country', 'mov_type', 'mov_language', 'mov_subtitles', 'mov_IMDb', 'mov_fileType', 'mov_fileResolution', 'mov_fileSize', 'mov_showTime', 'mov_director', 'mov_leadActor', 'mov_summary', 'mov_awards', 'mov_downloadUrl', 'mov_srcUrl', 'mov_poster', 'mov_stills', 'create_date'];
/**
 * movie构造函数
 * @constructor
 * @param {Array} arr - 传入一个包含与key(按照数据库中字段构成的一个数组)相对应的value的数组.
 * */
function movie(arr) {
    var i = 0,
        len = keys.length;
    while (i < len) {
        this[keys[i]] = arr[i];
    }
    return this;
}

/**
 * 监听事件对象
 * */
var sql = 'INSERT INTO `blog_movie` (`mov_cnName`,`mov_enName`,`mov_year`,`mov_country`,`mov_type`,`mov_language`,`mov_subtitles`,`mov_IMDb`,`mov_fileType`,`mov_fileResolution`,`mov_fileSize`,`mov_showTime`,`mov_director`,`mov_leadActor`,`mov_summary`,`mov_awards`,`mov_downloadUrl`,`mov_srcUrl`,`mov_poster`,`mov_stills`,`create_date`)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now())';

addEvent('saveMovie', function(data, res) {
    var $zoom = data('#Zoom');
    var sHtml = $zoom.find('p').eq(0).text();
    var arrRes = sHtml.match(/◎译\s*名(.*)◎片\s*名(.*)◎年\s*代(.*)◎国\s*家(.*)◎类\s*别(.*)◎语\s*言(.*)◎字\s*幕(.*)◎IMDb评分(.*)◎文件格式(.*)◎视频尺寸(.*)◎文件大小(.*)◎片\s*长(.*)◎导\s*演(.*)◎主\s*演(.*)◎简\s*介(.*)/i);

    var arrData = arrRes.slice(1).map(function(item) {
        return item.trim();
    });
    res.send(arrData.concat(download, sMoviePoster, sMovieStills));
});

function getMovie(url, res, next) {
    "use strict";
    var options = {
        charset: 'gb2312'
    }
    agent.getDom(url, options, (err, $) => {
        if (err) {
            next(err);
        } else {
            myEmit.emit('saveMovie', $, res);
        }
    });
}

exports.getMovie = getMovie;
