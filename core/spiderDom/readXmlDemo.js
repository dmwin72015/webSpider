var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
var myTool = require('../common/mysql_connect');

var sql_step = 'INSERT INTO `dong_steps` (`type`, `sourceName`, `steps`, `startDate`, `endDate`, `creationDate`) VALUES (?,?,?,?,?,?)';
var sql_walk = 'INSERT INTO `dong_steps` (`type`, `sourceName`, `walks`,`unit`, `startDate`, `endDate`, `creationDate`) VALUES (?,?,?,?,?,?,?)';

var sql = 'INSERT INTO `dong_steps` (`type`, `sourceName`, `walks`, `steps`, `unit`, `sourceVersion`, `device`, `startDate`, `endDate`, `creationDate`) VALUES (?,?,?,?,?,?,?,?,?,?)';

var protoString = Object.prototype.toString;

var arrNodeData = [];
var queryprom = myTool.queryProm;
fs.readFile('data.xml', 'utf8', (err, data)=> {
    // console.log(data);
    var doc = new DOMParser().parseFromString(data, 'text/xml');
    var arrNodes = doc.documentElement.childNodes;
    var i = 0,
        len = arrNodes.length;
    for (; i < len; i++) {
        var ele = arrNodes[i];
        var sNodeName = ele.nodeName || '';
        if (sNodeName == 'Record') {
            var attrs = ele.attributes;
            // process.exit(1);
            var tmpObj = {
                nodeName: sNodeName,
                data: {}
            };
            for (var j = 0, len2 = attrs.length; j < len2; j++) {
                tmpObj.data[attrs[j]['name']] = attrs[j]['value']
            }
            var _data = [tmpObj.data.type, tmpObj.data.sourceName];
            if (tmpObj.data && tmpObj.data.unit == 'count') {
                _data = _data.concat([null, tmpObj.data.value]);
            } else {
                _data = _data.concat([tmpObj.data.value, null]);
            }
            _data = _data.concat([
                tmpObj.data.unit,
                tmpObj.data.sourceVersion || '',
                tmpObj.data.device || '',
                tmpObj.data.startDate || '',
                tmpObj.data.endDate || '',
                tmpObj.data.creationDate || ''
                ]);
            arrNodeData.push(tmpObj);
            queryprom(sql, _data).then((rows)=> {
                console.log('保存成功' + rows.insertId);
            }).catch((e)=> {
                console.log('保存失败' + e.stack);
            });
        }
    }
});

