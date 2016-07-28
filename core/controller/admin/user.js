var _ = require('lodash');
var mysqlTool = require('../../common/mysql_connect');
var ERRORS = require('../../../config/error_info');
module.exports = {
    'index': function (req, res, next) {

    },
    'add|post': function (req, res, next) {
        var data = req.body;
        if (_.isEmpty(data)) {
            res.send({
                code: '106',
                message: ERRORS['106'],
                info: {
                    data: null,
                    err: ERRORS['106']
                }
            }).end();
            return;
        }
        var query = mysqlTool.queryProm;
        var sName = data.name;
        var sNick = data.nickname;
        var sEmail = data.email;
        var sWebsite = data.website;
        var sRole = data.role;
        var sDesc = data.description;
        var sql = 'insert into `dongmin`.`blog_users` (`user_login`,`user_pass`,  `user_nicename`, `user_email`,`user_url`,`user_registered`, , `user_roleID`,`user_rolename`, `display_name`, `user_status`, ) values (?,?,?,?,?,?,?,?,?,?)';
        var data = [];
        query(sql, data).then((rows)=> {

        }).catch((err)=> {

        }).then(()=> {

        });
    }
};
