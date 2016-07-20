const mysql = require('mysql');

/*获取列*/
function getColums(obj) {
    return Object.keys(obj).map((item) => {
        return item.trim();
    });
    /*
    .map((item)=>{
        return mysql.escapeId(item);
    });
    */
}
/*判断插入的数据的列是否与表中的列对应*/
function hasRelative(mod, condition) {
    var arrCloums = getColums(mod);
    var arrCondition = Object.keys(obj);
    if (!isContains(arrCloums, arrCondition)) {
        return;
    }
    return true;
}

/*
判断数据是否有包含关系
*/
function isContains(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        return false;
    }
    var len1 = arr1.length,
        len2 = arr2.length;
    var arrBig, arrSmall;
    len1 > len2 ? (arrBig = arr1, arrSmall = arr2) : (arrBig = arr2, arrSmall = arr1);
    len1 = arrBig.length, len2 = arrSmall.length;

    for (var i = 0; i < len2; i++) {
        var flag = false;
        for (var j = 0; j < len1; j++) {
            if (arrSmall[i] == arrBig[j]) {
                flag = true;
                continue;
            }
        }
        if (flag) {
            continue;
        } else {
            return;
        }
    }

    return true;
}

/*插入语句*/
function insertSql(mod, condition) {
    var arrTable = getColums(mod.attributes);
    var arrCond = getColums(condition);
    if (!isContains(arrTable, arrCond)) {
        console.log('数据中的列与表中的字段不对应');
        return;
    }
    var arrValue = [];
    var arrColum = [];
    var sql = 'INSERT INTO ' + mysql.escapeId(mod.tableName) + '(';
    for (var col in condition) {
        if (!mod.attributes[col].autoIncrement) {
            arrColum.push(mysql.escapeId(col));
            // arrValue.push(condition[col] == 'now()' ? 'now()' :'"'+condition[col]+'"');
            arrValue.push(condition[col] == 'now()' ? 'now()' :'?');
        }
    }
    sql += arrColum.join(',') + ')VALUES(' + arrValue.join(',') + ');';
    return sql;
}
/*删除*/
/*
obj =>{
    id:'12',
    name:23,
    ...
}
*/
function deleteSql(mod, condition) {
    if (!hasRelative(mod, condition)) {
        return;
    }
    var sql = 'DELETE FROM ' + mysql.escapeId(mod.tableName) + 'WHERE ';
    var tmpArr = [];
    for (var col in condition) {
        tmpArr.push(mysql.escapeId(col) + '=' + condition(col))
    }
    sql += tmpArr.join(' AND ');
    return sql;
}


module.exports = {
    insertSql: insertSql,
    deleteSql: deleteSql
};
