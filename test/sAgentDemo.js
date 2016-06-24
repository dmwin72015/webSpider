const cheerio = require('cheerio');
const sAgentCharset = require('superagent-charset');
const sAgent = sAgentCharset(require('superagent'));
const fs = require('fs');
const http = require('http');
const https = require('https');

/*
sAgent
    .head('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=node%20%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7&oq=superagent%20%E8%87%AA%E5%8A%A8%E7%BC%96%E7%A0%81&rsv_pq=f2e336de000e2d9d&rsv_t=70ef5dO5Y9KwBfx%2F4cTNdCH3UuN%2FDkSJNu3qIdUFe9o8jD0Cb1uI0hQgUqo&rqlang=cn&rsv_enter=1&inputT=10112&rsv_sug3=44&rsv_sug1=30&rsv_sug7=100&bs=superagent%20%E8%87%AA%E5%8A%A8%E7%BC%96%E7%A0%81')
    .set({'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'})
    .end((err, res)=> {
        "use strict";
        // for(var name in res ){
        //     console.log(name);
        // }
        // console.log(res.headers['content-type']);

        console.log(res.header['content-type']);
    });
*/
var options = {
    // protocol:'https',
    host: 'www.baidu.com',
    // path: '/application/node/post.php',
    method: 'get',
    // headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Content-Length': contents.length
    // }
};
// console.log(http.METHODS);
var req = https.request(options,(res)=>{
    "use strict";
    // res.setEncoding('utf8');
    // console.log(res.headers);
    // console.log(res.headers['content-type']);
    res.on('data',(chunk)=>{
        var html = chunk.toString();
        var charset =  html.match(/<meta http-equiv="content-type" content="text\/html;charset=(.*?)">/i);
        if(!charset) return;
        console.log(charset[1]);

    });
});
req.end();