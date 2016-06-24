/**
 * Created by yxp on 2016/6/23.
 */
const agent = require('../util/myAgent');
const addEvent = require('../util/myEmitter').addEvent;
/**
 * movie构造函数
 * @constructor
 * */
function movie() {

}

/**
 * 监听事件对象
 * */
var myEmit = addEvent('getMovie', function (data, res) {
    var $zoom = data('#Zoom');
    var sHtml = $zoom.find('p').eq(0).text();
    var arrRes = sHtml.match(/◎译\s*名(.*)◎片\s*名(.*)◎年\s*代(.*)◎类\s*别(.*)◎语\s*言(.*)◎字\s*幕(.*)◎IMDb评分(.*)◎文件格式(.*)◎视频尺寸(.*)◎文件大小(.*)◎片\s*长(.*)◎导\s*演(.*)◎主\s*演(.*)◎简\s*介(.*)/i);

    var cnName = arrRes[1].trim();
    var enName = arrRes[2].trim();
    var sYear = arrRes[3].trim();
    var sType = arrRes[4].trim();
    var sLanguage = arrRes[5].trim();
    var sResolution = arrRes[6].trim();
    var sIMDb = arrRes[7].trim();
    var sFilmExt = arrRes[8].trim();
    var sFilmResolution = arrRes[9].trim();
    var sFileSize = arrRes[10].trim();
    var sFileTime = arrRes[11].trim();
    var sDirector = arrRes[12].trim();
    var sActor = arrRes[13].trim();
    var sSummary = arrRes[14].trim();
    var download = $zoom.find('table a').attr('thunderrestitle');

    


    res.send(arrRes);
});

function getMovie(url, res, next) {
    "use strict";
    var options = {
        charset: 'gb2312'
    }
    agent.getDom(url, options, (err, $)=> {
        if (err) {
            next(err);
        } else {
            myEmit.emit('getMovie', $, res);
        }
    });
}

var sql = 'INSERT INTO `blog_movie` (`mov_cn_name`, `mov_en_name`, `mov_year`, `mov_country`, `mov_language`, `mov_IMDb`, `mov_fileType`, `mov_fileResolution`, `mov_fileSize`, `mov_showTime`, `mov_director`, `mov_leadActor`, `mov_summary`, `mov_awards`, `mov_downloadUrl`, `mov_srcUrl`, `create_date`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

exports.getMovie = getMovie;