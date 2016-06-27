var express = require('express');
var router = express.Router();
var chat = require('../model/chat');


router.get('/',(req,res,next)=>{
    res.render('chat/chat_index',{
        title:'聊天'
    });
});

module.exports = router;