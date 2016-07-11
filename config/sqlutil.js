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
 * */
function createTable(model) {
    var tableName = model.tableName || '';
    if (!tableName) {
        console.error('没有tableName属性,此属性为必须属性');
        return;
    }
    tableName = 'blog_movie_test';
    tableName = mysql.escapeId(tableName);
    var sql = 'USE `dongmin`;DROP TABLE IF EXISTS ' + tableName + ';create table ' + tableName + ' (';

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
            console.log(tmpPrk);
            _.each(columns, (v, k)=> {
                var col = columns[k];
                var colName = mysql.escapeId(col.colName || k);
                var prkFlag = tmpPrk.indexOf(colName) > -1;
                var type = sqlTypeCast(col);
                var unique = col.unique ? prkFlag ? '' : 'unique'.toUpperCase() : '';
                var isNUll = col.canNull ? '' : 'NOT NULL';
                var defContent = isNUll ? '' : col.default ? 'DEFAULT ' + col.default : 'DEFAULT';
                var auto_increment = type.indexOf('INT') > -1 && col.autoIncrement ? 'AUTO_INCREMENT' : '';
                var prk = col.primaryKey ? prkFlag ? '' : 'PRIMARY KEY' : '';
                var comment = col.comment ? 'COMMENT "' + col.comment + '"' : '';
                var strCol = colName + ' ' + type + ' ' + isNUll + ' ' + unique + ' ' + defContent + ' ' + prk + ' ' + auto_increment + ' ' + comment;
                sqlCol.push(strCol);
            });

            sqlCol.push('PRIMARY KEY (' + tmpPrk.join(',') + ')');
            sql += sqlCol.join(',');
            sql += ')ENGINE=InnoDB DEFAULT CHARSET=' + (model.charset || 'utf8') + ';';

            return sql;
            // return sqlCol;
        }

    }
    return model;
}


/**
 * 根据查询出来的列生成model文件
 * @param {Array} table  - desc table;返回的结果(所有列信息)
 * */
function createModelFile(table) {

}


module.exports = {
    model2sql: createTable
};