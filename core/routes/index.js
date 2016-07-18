var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/*', (req, res, next) => {
    if (req.path == 'favicon.ico') {
    	console.log('过滤掉图标请求！！');
        res.end();
        return;
    }
    next();
});

module.exports = router;
