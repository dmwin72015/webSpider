var express = require('express');
var router = express.Router();

const movieTool = require('../model/movie');
const addEvent = require('../util/myEmitter').addEvent;

router.post('/',(req,res,next)=>{
    "use strict";
    var sURl = 'http://www.ygdy8.net/html/gndy/dyzz/20160619/51244.html';
    movieTool.getMovie(sURl,res,next);
});

module.exports = router;