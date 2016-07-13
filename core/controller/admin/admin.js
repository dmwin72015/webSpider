/**
 * Created by yxp on 2016/7/13.
 */
module.exports = {
    'index': (req, res, next)=> {
        res.end('admin首页');
    },
    'articleList': (req, res, next)=> {
        res.end(req.path);
    }
};