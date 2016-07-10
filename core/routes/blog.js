var express = require('express');
var router = express.Router();
var pool = require('./mysql_connect');

router.get('/', (req, res, next) => {
    var sql = 'SELECT id, mov_cnName, mov_enName, mov_year, mov_country, mov_type, mov_language, mov_subtitles, mov_IMDb, mov_fileType, mov_fileResolution, mov_fileSize, mov_showTime, mov_director, mov_leadActor, mov_summary, mov_downloadUrl, mov_srcUrl,mov_poster FROM blog_movie limit 10,5;';
    pool.query(sql, (err, row) => {
        if (err) {
        	next();
        } else {
            var i = 0,
                len = row.length,
                arr = [];
            if (!len){
            	 next();
            	 return;
            }
            for (; i < len; i++) {
                var obj = {
                    ID: row[i]['id'],
                    title: row[i]['mov_cnName'],
                    title_en: row[i]['mov_enName'],
                    type: row[i]['mov_type'],
                    country: row[i]['mov_country'],
                    time: row[i]['mov_showTime'],
                    img: row[i]['mov_poster'],
                    summary: row[i]['mov_summary'],
                    href:row[i]['mov_srcUrl']
                };
                arr.push(obj);
            }
            res.render('blog/index', {
                data: arr
            });
        }
    });
}).get('/index', (req, res, next) => {


});










module.exports = router;
