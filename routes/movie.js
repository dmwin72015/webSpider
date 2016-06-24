var express = require('express');
var router = express.Router();

const movieTool = require('../model/movie');
const addEvent = require('../util/myEmitter').addEvent;

router.post('/', (req, res, next)=> {
    "use strict";
    var url = req.body.url;
    var pathname = req.body.pathname;
    if(/.*\/$/ig.test(url)){
        url = url.slice(0,-1);
    }
    if (!url) {
        next();
    } else {
        // movieTool.getMovie(sURl,res,next);
        movieTool.getMovieUrl(url, res, next);
    }
    return;
});

module.exports = router;