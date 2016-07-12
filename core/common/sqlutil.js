/**
 * Created by yxp on 2016/7/11.
 */
const _ = require('lodash');
const mysql = require('mysql');
/**
 * 根据model中类型生成的数据库中对应的字段类型
 * @param {object|JSON}  attr  - model中attributes,或者attributes的type属性.
 * @return {string} - 对应数据库中的类型
 * */
function sqlTypeCast(attr) {
    if (!attr) return 'VARCHAR(255)';
    var type;//model中的类型
    var size;//长度
    var expandedType;//对应的数据的类型

    type = _.isObject(attr) && _.has(attr, 'type') ? attr.type : (attr ? attr.toLowerCase() : attr);

    switch (type) {
        case 'string':
        {
            size = 255; // By default.
            // If attr.size is positive integer, use it as size of varchar.
            if (!Number.isNaN(attr.size) && (parseInt(attr.size) === parseFloat(attr.size)) && (parseInt(attr.size) > 0)) {
                size = attr.size;
            }

            expandedType = 'VARCHAR(' + size + ')';
            break;
        }

        case 'text':
        case 'array':
        case 'json':
            expandedType = 'LONGTEXT';
            break;

        case 'mediumtext':
            expandedType = 'mediumtext';
            break;

        case 'longtext':
            expandedType = 'longtext';
            break;

        case 'boolean':
            expandedType = 'BOOL';
            break;

        case 'int':
        case 'integer':
        {
            size = 32; // By default

            if (!Number.isNaN(attr.size) && (parseInt(attr.size) === parseFloat(attr.size)) && (parseInt(size) > 0)) {
                size = parseInt(attr.size);
            }

            // MEDIUMINT gets internally promoted to INT so there is no real benefit
            // using it.

            switch (size) {
                case 8:
                    expandedType = 'TINYINT';
                    break;
                case 16:
                    expandedType = 'SMALLINT';
                    break;
                case 32:
                    expandedType = 'INT';
                    break;
                case 64:
                    expandedType = 'BIGINT';
                    break;
                default:
                    expandedType = 'INT';
                    break;
            }

            break;
        }

        case 'float':
        case 'double':
            expandedType = 'FLOAT';
            break;

        case 'decimal':
            expandedType = 'DECIMAL';
            break;

        case 'date':
            expandedType = 'DATE';
            break;

        case 'datetime':
            expandedType = 'DATETIME';
            break;

        case 'time':
            expandedType = 'TIME';
            break;

        case 'binary':
            expandedType = 'BLOB';
            break;

        default:
            console.error('Unregistered type given: %s,using [LONGTEXT] instead of %s', type, type);
            expandedType = 'LONGTEXT';
            break;
    }

    return expandedType;
}
/**
 * 逆转 sqlTypeCast, 根据数据库中的类型,生成model类型.
 * {@link sqlTypeCast}
 * @param {string} - attr 数据库种类型
 * @return {string}  model类型
 * */
function sqlTypeCastReverse(attr) {
    if (!attr) return;
    var modAttr = '';
    //TODO 未完成
    switch (attr.toLowerCase()) {
        case 'varchar':
            modAttr = 'string';
            break;
        case 'int':
            modAttr = 'integer';
            break;
        case 'float':
            modAttr = 'float';
            break;
        default:
            modAttr = 'string'
            break;

    }
}
/**
 * 把日期格式转换成sql中日期格式
 * @param {Date}  data - 日期格式的对象
 * @return {string} - 数据库中对应的格式
 * */
function toSqlDate(date) {
    date = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' +
        ('00' + date.getSeconds()).slice(-2);

    return date;
}
/**
 * 根据model对象创建表结构sql语句
 * @param {object|JSON} model -  model对象
 * @return {string} - 返回对应的创建表的sql语句 ,如果 model格式 不对,则返回传入的model
 * @tips - //TODO 这里的sql语句一次只能执行一条,如果一次执行两条sql语句就会报错.
 * */
function createTable(model) {
    var tableName = model.tableName || '';
    if (!tableName) {
        console.error('没有tableName属性,此属性为必须属性');
        return;
    }
    tableName = 'blog_movie_test';
    tableName = mysql.escapeId(tableName);
    var sql = 'DROP TABLE IF EXISTS ' + tableName + ';create table ' + tableName + ' (';

    if (_.isObject(model) && _.has(model, 'attributes')) {
        var columns = model.attributes;//所有列属性对象
        var keys = _.keys(columns);//所有列属性的key组成数组

        var sqlCol = [];//临时保存每一列的sql语句

        if (_.isObject(columns) && !_.isEmpty(columns)) {

            var prk = model.primaryKey || [];
            var tmpPrk = [];//存放主键
            if (_.isArray(prk) && prk.length > 0) {
                for (var i = 0, len = prk.length; i < len; i++) {
                    var sPrk = prk[i];
                    if (keys.indexOf(sPrk) > -1) {
                        tmpPrk.push(mysql.escapeId(columns[sPrk].colName || sPrk));
                    }
                }
            } else if (_.isString(prk)) {
                if (keys.indexOf(prk) > -1) {
                    tmpPrk.push(mysql.escapeId(columns[sPrk].colName || sPrk));
                }
            }

            _.each(columns, (v, k)=> {
                var col = columns[k];
                var colName = mysql.escapeId(col.colName || k);
                var prkFlag = tmpPrk.indexOf(colName) > -1;
                var type = sqlTypeCast(col);
                var unique = col.unique ? prkFlag ? '' : 'unique'.toUpperCase() : '';
                var canNull = col.canNull ? '' : 'NOT NULL';
                var defContent = isNUll ? '' : col.default ? 'DEFAULT ' + col.default : 'DEFAULT';
                var auto_increment = type.indexOf('INT') > -1 && col.autoIncrement ? 'AUTO_INCREMENT' : '';
                var prk = col.primaryKey ? prkFlag ? 'UNSIGNED' : 'UNSIGNED PRIMARY KEY' : '';
                var comment = col.comment ? 'COMMENT "' + col.comment + '"' : '';
                var strCol = colName + ' ' + type + ' ' + canNull + ' ' + unique + ' ' + defContent + ' ' + prk + ' ' + auto_increment + ' ' + comment;
                sqlCol.push(strCol);
            });

            sqlCol.push('PRIMARY KEY (' + tmpPrk.join(',') + ')');
            sql += sqlCol.join(',');
            sql += ')ENGINE=InnoDB DEFAULT CHARSET=' + (model.charset || 'utf8') + ';';
            return sql;
        }
    }
    return model;
}


/**
 * 根据查询出来的列生成model文件
 * @param {Array} table  - desc table;返回的结果(所有列信息)
 * @return {string} - 返回的model.
 * */
function createModel(tableName, table) {
    if (!_.isArray(table)) {
        return table;
    }
    var i = 0, len = table.length;
    if (len <= 0) {
        console.error('这是一张空表,略过创建');
        return;
    }
    var attrs = {};
    for (; i < len; i++) {
        var col = table[i];
        var colName = col['Field'];
        var sType = col['Type'] || 'string';//bigint(20) unsigned
        var canNull = col['Null'] == 'NO' ? false : true;
        var sKey = col['Key'];
        var sDef = col['Default'];
        var sExtra = col['Extra'];
        var nSize = 0;
        var aSize = sType.match(/(\w*)\(([\d,]+)\)(\s\w+)?/);
        if (aSize) {
            sType = aSize[1] || 'string';
            nSize = aSize[2] || (sType == 'string' ? 255 : '');
        }
        attrs[colName] = {
            colName: colName,
            type: sType,
            size: nSize,
            canNull: canNull ? true : false,
            autoIncrement: sExtra.indexOf('auto_increment') > -1 ? true : false,
            unique: sKey == 'UNI' ? true : false,
            sDefault: sDef
        };
    }
    var obj = {
        tableName: tableName,
        charset: 'utf8',
        attributes: attrs
    }
    return ('module.exports = ' + JSON.stringify(obj) + ';').replace(/\"/g,"'");
}


module.exports = {
    model2sql: createTable,
    sql2model: createModel
};