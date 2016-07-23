var mysqlTool = require('../common/mysql_connect');
var queryProm = mysqlTool.queryProm;
module.exports = {
    'index': function (req, res, next) {
        // res.end('这是首页');
        var sql = 'SELECT id, arti_name, arti_author_name, arti_textcontent, arti_htmlcontent, arti_label, arti_cate_name, pub_time, read_num FROM blog_article WHERE arti_author_id = 1002 ORDER BY pub_time DESC LIMIT 10';
        queryProm(sql).then((rows) => {
            return rows;
        }).catch((err) => {
            return new Array(5);
        }).then((rows) => {
            res.render('blog/index', {
                data: rows
            });
        });
        return;
    },
    'article/:artid': function (req, res, next) {
        var id = req.params.artid;
        if (!id) {
            next();
            return;
        }
        var sql = '(SELECT * FROM blog_article WHERE id<? ORDER BY id desc limit 1) UNION ALL (SELECT * FROM blog_article WHERE id >=? ORDER BY id ASC LIMIT 2);'
        // var sql = 'SELECT id, arti_name, arti_author_name, arti_textcontent, arti_htmlcontent, arti_label, arti_cate_name, pub_time, read_num FROM blog_article WHERE id=? or id=? or id= ?';
        queryProm(sql, [id,id]).then((rows)=> {
            if (rows.length) {
                return rows;
            } else {
                next();
            }
        }).catch((err)=> {
            next();
        }).then((result)=> {
            // console.log(result);
            if (result) {
                if (result.length == 3) {
                    var sHtml = result[1].arti_htmlcontent;
                    res.render('blog/article', {
                        title: result[1].arti_name,
                        author: result[1].arti_author_name,
                        html: sHtml,
                        pubtime: result[1].pub_time.split(' ')[0],
                        readnum: result[1].read_num,
                        text: result[1].arti_textcontent,
                        categary: result[1].arti_cate_name.toUpperCase(),
                        next: {name:result[2].arti_name,id:result[2].ID},
                        prev: {name:result[0].arti_name,id:result[0].ID}
                    });
                }else if(result.length == 2){
                    var tempId = -1 ;
                    for(var i=0;i<2;i++){
                        if(result[i].ID == id){
                            tempId = id;
                            break;
                        }
                    }
                    if(tempId == -1){
                        next(404);
                    }else{
                        if(result[tempId+1]){
                            var next = {name:result[tempId+1].arti_name,id:result[tempId+1].ID},
                                prev = null;
                        }else{
                            var next = null,
                                prev = {name:result[tempId-1].arti_name,id:result[tempId-1].ID};
                        }
                        res.render('blog/article', {
                            title: result[tempId].arti_name,
                            author: result[tempId].arti_author_name,
                            html: sHtml,
                            pubtime: result[tempId].pub_time.split(' ')[0],
                            readnum: result[tempId].read_num,
                            text: result[tempId].arti_textcontent,
                            categary: result[tempId].arti_cate_name.toUpperCase(),
                            next: next,
                            prev: prev
                        });
                    }
                }else if(result.length == 1){
                    if(result[0].ID == id){
                        res.render('blog/article', {
                            title: result[1].arti_name,
                            author: result[1].arti_author_name,
                            html: sHtml,
                            pubtime: result[1].pub_time.split(' ')[0],
                            readnum: result[1].read_num,
                            text: result[1].arti_textcontent,
                            categary: result[1].arti_cate_name.toUpperCase(),
                            next: null,
                            prev: null
                        });
                    }else{
                        next(404);
                    }
                }else{
                    next(404);
                }
            }
        });
    }
};
