const _ = require('lodash');
const agent = require('../common/myAgent');
const TIPS_INFO = require('../../config/error_info');
const sagent = require('superagent');

var arrImg = [];

function getImg(req, res, next) {
    var url = req.body.url || '';
    if (!url) {
        res.send({
            code: '101',
            message: TIPS_INFO['101'],
            info: {
                data: null,
                error: TIPS_INFO['101']
            }
        });
    }
    agent.getDom(url).then(($) => {
        $('div.img img').each((i, e) => {
            arrImg.push($(e).attr('src'));
        });
        res.send({
            code: '100',
            message: TIPS_INFO['100'],
            info: {
                data: arrImg,
                error: null
            }
        });
    }).catch((err) => {
        res.send({
            code: '103',
            message: TIPS_INFO['103'],
            info: {
                data: null,
                error: err.stack
            }
        });
    });
    return;
}

function getPageData(req, res, next) {
    var url = 'http://www.lofter.com/dwr/call/plaincall/TagBean.search.dwr';
    sagent.post(url)
        .set('Content-Type', 'text/plain')
        .accept('text/javascript')
        // .timeout(4000)
        .end((err, res) => {
            if (err) {
                throw err;
            }
            console.log(res);
            res.send(res);
        });
}

module.exports = {
    getImg: getImg
}
