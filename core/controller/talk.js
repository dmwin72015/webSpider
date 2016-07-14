module.exports = {
    'index': (req, res, next)=> {
        res.end('talk首页');
    },
    'articleList': (req, res, next)=> {
        res.end(req.path);
    }


};