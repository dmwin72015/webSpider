module.exports = {
    'index': (req, res, next)=> {
        res.end('admin首页');


    },
    'articleList': (req, res, next)=> {

        res.end(req.path);

    },
    'getArticle/:id': (req, res, next)=> {

        res.end(req.path);

    }
};