const cheerio = require('cheerio');
const sAgentCharset = require('superagent-charset');
const sAgent = sAgentCharset(require('superagent'));
const fs = require('fs');
const http = require('http');

const url = 'http://www.ruanyifeng.com/blog/2012/12/asynchronous＿javascript.html';
const head = {
    'Content-Type': 'text/html; charset=UTF-8'

};
// sAgent.get(url).end((err, res) => {
// 	console.log(res.text);
// })

var req = http.request(url, (res) => {
    res.on('data', (chunk) => {
        var html = chunk.toString();
        console.log(html);
    });
    res.on('end', () => {
        console.log('No more data in response.')
    })
});
req.end();
