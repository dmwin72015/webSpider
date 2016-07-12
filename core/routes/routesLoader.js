/**
 * Created by yxp on 2016/7/12.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const requireDir = require('require-directory');

console.log(`Current directory: ${process.cwd()}`);
// console.log(path.dirname(__dirname));

console.log('命令执行的位置:',process.cwd());

console.log('当前文件的位置',__dirname);
console.log('当前文件的绝对路径',path.resolve(__dirname));
var relaPath = path.relative(__dirname, 'D:\\projects\\webSpider\\core\\common');
console.log('当前路径相对于common的相对路径',relaPath);

console.log('当前',path.dirname(__dirname));

console.log(path.basename(module.filename));
// process.chdir(__dirname);

// var files = fs.readdirSync('..');
/*
 (err, files)=> {
 // if (err) throw err;

 console.log(files);
 setTimeout(console.log,2000,'延迟');

 }
 * */
// console.dir(files);