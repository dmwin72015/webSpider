var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/*', (req, res, next)=> {
    var sReqPath = req.path;
    if(sReqPath =='/favicon.ico'){
    	res.end();
    	return;
    }
    console.log(req.path);

    next();

});

module.exports = router;
