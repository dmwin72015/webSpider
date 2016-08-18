/**
 * Created by yxp on 2016/8/18.
 */


function saveCate(){


}


module.exports = {
    'index/:action|post': function (req, res, next) {
        var action = req.params.action;
        switch (action){
            case 'save':
                break;
            case 'del':
                break;
            case 'change':
                break;

        }
    }
};