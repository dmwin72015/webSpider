const _ = require('underscore');
const io = require('socket.io').listen('9080');

const agent = require('../util/myAgent');
const baseQuery = require('../util/mysql_connect')['query'];
const myEmit = require('../util/myEmitter')['emitter'];
const addEvent = require('../util/myEmitter').addEvent;

const keys = ['arti_name', 'arti_author_id', 'arti_author_name', 'arti_textcontent', 'arti_htmlcontent', 'arti_sorce', 'arti_status', 'arti_label', 'arti_cate_id', 'arti_cate_name', 'arti_editor', 'arti_from', 'pub_time', 'last_edit_time', 'read_permission', 'read_num', 'like_num', 'unlike_num', 'hot', 'create_time'];

/**
 * 构造函数
 * @constructor {array} - arr 保存着与keys一一对应的数据
 * @return  this - 生成的当前对象
 * */
function Article(data) {
    var that = this;
    if (!data) return that;
    if (Array.isArray(data) && data.length) {
        var i = 0,
            len = data.length;
        for (; i < len; i++) {
            that[keys[i]] = arr[i];
        }
    } else if (_.isObject(data)) {
        that = _.extendOwn(this, data);
    }
    return that;
}
/**
 * 扩展原型,增加公用方法.
 * 1.save @param {function} cb - 保存之后执行的回调函数
 * */
Article.fn = Article.prototype = {
    constructor: Article,
    save: function (cb) {
        if (!this.arti_name) return 'article_name 不存在';
        var sql = "INSERT INTO `blog_article` (`arti_name`, `arti_author_id`, `arti_author_name`, `arti_textcontent`, `arti_htmlcontent`, `arti_sorce`, `arti_status`, `arti_label`, `arti_cate_id`, `arti_cate_name`,`arti_editor` ,`arti_from`, `pub_time`, `last_edit_time`,`read_permission`,`read_num`,`like_num`,`unlike_num`,`hot`,`create_time`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," + (this.create_time || 'now()') + ");";
        var arrData = [
            this.arti_name,
            this.arti_author_id || 1,
            this.arti_author_name || 'admin',
            this.arti_textcontent || '无内容',
            this.arti_htmlcontent || '<p>无内容</p>',
            this.arti_sorce || '',
            this.arti_status || 1,
            this.arti_label || '',
            this.arti_cate_id || 0,
            this.arti_cate_name || '',
            this.arti_editor || '',
            this.arti_from || '',
            this.pub_time || '0000-00-00',
            this.last_edit_time || '0000-00-00',
            this.read_permission || 1,
            this.read_num || 0,
            this.like_num || 0,
            this.unlike_num || 0,
            this.hot || 0
            // this.create_time || 'now()'
        ];

        baseQuery(sql, arrData, (err, rows) => {
            //留着测试.链接数据库出错的时候
            if (err) {
                throw err;
                return;
            }
            cb && cb(err, rows);
        });
    }
}

/**
 * 捕获取页面中文章链接,把获取到所有的符合条件的连接在返回到前台
 * @param {string} url - 获取连接的主页面的url
 * @param {function} cb - 回调处理函数
 * */
function getArticleLinkFromWeb(url, cb) {
    agent.getDom(url, (err, data) => {
        if (err) {
            var json = {err: 0, d: data};
        } else {
            var $ = data,
                $li = $('#alpha-inner li.module-list-item'),
                i = 0,
                len = $li.length,
                tmpArr = [];
            for (; i < len; i++) {
                var $a = $li.eq(i).find('a');
                var href = $a.attr('href');
                var txt = $a.text();
                if (href && tmpArr.indexOf(href) < 0) {
                    tmpArr.push({
                        name: txt,
                        href: href
                    });
                }
            }
            var json = {err: 1, d: tmpArr};
        }
        cb && cb(json);
    });
}


/**
 * 添加监听: 获取DOM从页面中
 * 传递过来的参数:
 *  id(临时生成的ID,方便在后台处理之后,回传来获取前台元素),
 *  url(当前页面的url),
 *  socket(当前连接的socket)
 * */
addEvent('get article from web', (arg) => {
    if (!arg.url) return;
    var url = encodeURI(arg.url);
    agent.getDom(url, (err, data) => {
        if (err) {
            arg.socket.emit('dataFromServer', {
                err: 0,
                data: data,
                id: arg.id,
                href: url
            });
        } else {
            myEmit.emit('save article to database', data, arg);
        }
    });
});

/**
 * 保存到数据库
 * 根据传递过来的dom,以及一些其他信息:如url,socket,等等,将数据保存到数据库.
 * */
addEvent('save article to database', (dom, arg) => {
    var $ = dom;
    var $content = $('#content');
    var article = {
        arti_name: $('#page-title').text(),
        arti_author_id: '1001',
        arti_author_name: $content.find('article.hentry p.vcard.author a').text(),
        arti_textcontent: $('#main-content').text(),
        arti_htmlcontent: $('#main-content').html(),
        arti_sorce: arg.url,
        arti_status: 1,
        arti_label: $content.find('.entry-categories ul a').text(),
        arti_cate_id: '2',
        arti_cate_name: $content.find('div.entry-categories ul').text(),
        arti_editor: $content.find('article.hentry p.vcard.author a').text(),
        arti_from: arg.url,
        pub_time: $content.find('abbr.published').attr('title').replace('T', ' ').split('+')[0]
    };

    var arti = new Article(article);

    arti.save((err, rows) => {
        var oDataBack = {
            err: err ? 0 : 1,
            data: err ? err : arti,
            url : arg.url,
            id: arg.id,
            rows:rows
        };
        arti = null;
        arg.socket.emit('dataFromServer', oDataBack);
    });
});

/**
 * 使用socket的方式,监听连接事件.
 */

io.on('connection', (socket) => {
    // console.log(socket.id + ',,,链接....1111');

    // 使用socket监听 获取文章数据事件(获取从客户端传来的url)
    socket.on('get_article_data', (data) => {
        if (!data) return;

        myEmit.emit('get article from web', {
            id: data.id,
            url: data.url,
            socket: socket
        });
    });


});

module.exports = {
    getryf: getArticleLinkFromWeb
};