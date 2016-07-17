var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/*', (req, res, next) => {
    if (req.path == 'favicon.ico') {
        res.end();
        return;
    }
    next();
});

module.exports = router;
