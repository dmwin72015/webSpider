var express = require('express');
var router = express.Router();

const movieTool = require('../controller/movie');

router.post('/', (req, res, next)=> {
    "use strict";
    var url = req.body.url;
    var pathname = req.body.pathname;
    if (/.*\/$/ig.test(url)) {
        url = url.slice(0, -1);
    }
    if (!url) {
        next();
    } else {
        // movieTool.getMovie(sURl,res,next);
        movieTool.getMovieUrl(url, res, next);
    }
    return;
}).get('/list', (req, res, next)=> {
    movieTool.getMovAll((err, data)=> {
        if (err) {
            next(data);
        } else {
            console.log(data.length);
            res.render('movie/movie_list', {
                arr: data
            });
        }
    });
    return;
}).get('/list:id', (req, res, next)=> {
    var id  = req.param.id || -1;
    return;
});

module.exports = router;