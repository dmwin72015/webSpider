var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/*', (req, res, next)=> {
    var sReqPath = req.path;
    if(sReqPath =='/favicon.ico'){
    	res.end();
        return;
    }
    if(sReqPath === '/'){
        res.end('这是首页');
        return;
    }
    console.log(sReqPath);
    next();
    // return;
});

module.exports = router;
