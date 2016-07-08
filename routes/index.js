var express = require('express');
var path  = require('path');
var router = express.Router();
/* GET home page. */
router.get('/*', (req, res, next)=> {
    console.log(req.path);
    next();

});

module.exports = router;
