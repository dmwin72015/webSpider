var html2jade = require('html2jade');
var fs = require('fs');

var html = '<li>我是一个li</li>';
var arrHtml = ['<b>aaaaa</b>','<div>aaaaaaa</div>'];

var currPath = process.cwd();

var config = {
	donotencode:true
}

html2jade.convertHtml(arrHtml, config, (err, jade) => {
    fs.writeFile(currPath + '/a.pug', jade, (err) => {
        if (err) {
            throw err;
        }
        console.log('保存成功');
    });
});
