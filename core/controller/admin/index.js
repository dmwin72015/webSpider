module.exports = {
    'index': (req, res, next) => {
        res.end('admin首页');


    },
    'articleList': (req, res, next) => {

        res.end(req.path);

    },
    'getArticle/:id|post': (req, res, next) => {
        res.end(req.path);
    },
    'testRoute/:name|post': {
        'subroute1': (req, res, next) => {
            
        },
        'subroute2': (req, res, next) => {

        }
    },
    'tst': {
        a: 12
    }
};
