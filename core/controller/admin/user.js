var _ = require('lodash');
var mysqlTools = require('../../common/mysql_connect');
const ERRORS = require('../../../config/error_info');

/*存储到数据库*/
function saveUser(req, res, next) {
    if(_.isEmpty(req.body)){
        res.send({}).end();
        return;
    }
    var params = req.body;
    var sName = params.realname,
        sNick = params.nickname,
        sEmail = params.email,
        sWeb = params.website,
        sRole = params.role,
        sDesc = params.description;
    if(!sEmail){
        res.send({}).end();
        return;
    }
    var data = [sEmail,sNick,sEmail,sRole,sWeb,sName];
    var sql = "INSERT INTO `blog_users` (user_login,user_pass,user_nicename,user_email,user_rolename,user_url,user_status,display_name,user_registered,create_date) VALUES (?,'000000',?,?,?,?,'1',?,now(),now());";
    mysqlTools.queryProm(sql,data).then((rows)=>{
        console.log(rows);
        return {
            code:'100',
            message:ERRORS['100'],
            info:{
                d:rows,
                err:null
            }
        };
    }).catch((err)=>{
        return {
            code:'104',
            message:ERRORS['104'],
            info:{
                d:null,
                err:err
            }
        };
    }).then((result)=>{
        res.send(result).end();
    });
}

module.exports = {
    'index/:action|post': function (req, res, next) {
        var action = req.params.action;
        console.log(action);
        switch (action) {
            case 'add':
                saveUser(req, res, next);
                break;

            case 'del':

                break;

            case 'update':

                break;
            default:
                next();
                break;
        }
    }
}

