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
        if (!id || isNaN(Number(id))) {
            next({message:'页面不存在',
                status:404,
                stack:'文章的ID格式不正确'
            });
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
            console.log(result[0].arti_name);
            if (result && result.length) {
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
                    var tempIndex = -1 ;
                    for(var i=0;i<2;i++){
                        if(result[i].ID == id){
                            tempIndex = i;
                            break;
                        }
                    }
                    if(tempIndex == -1){
                        next(404);
                    }else{
                        if(result[tempIndex+1]){
                            var nextArt = {name:result[tempIndex+1].arti_name,id:result[tempIndex+1].ID},
                                prevArt = null;
                        }else{
                            var nextArt = null,
                                prevArt = {name:result[tempIndex-1].arti_name,id:result[tempIndex-1].ID};
                        }
                        res.render('blog/article', {
                            title: result[tempIndex].arti_name,
                            author: result[tempIndex].arti_author_name,
                            html: sHtml,
                            pubtime: result[tempIndex].pub_time.split(' ')[0],
                            readnum: result[tempIndex].read_num,
                            text: result[tempIndex].arti_textcontent,
                            categary: result[tempIndex].arti_cate_name.toUpperCase(),
                            next: nextArt,
                            prev: prevArt
                        });
                    }
                }else if(result.length == 1){
                    if(result[0].ID == id){
                        res.render('blog/article', {
                            title: result[0].arti_name,
                            author: result[0].arti_author_name,
                            html: sHtml,
                            pubtime: result[0].pub_time.split(' ')[0],
                            readnum: result[0].read_num,
                            text: result[0].arti_textcontent,
                            categary: result[0].arti_cate_name.toUpperCase(),
                            next: null,
                            prev: null
                        });
                    }else{
                        next({message:'页面不存在',
                            status:404,
                            stack:'文章的ID不存在'
                        });
                    }
                }else{
                    next();
                }
            }
        });
    }
};
