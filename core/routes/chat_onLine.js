var express = require('express');
var router = express.Router();
var chat = require('../controller/chat');


router.get('/',(req,res,next)=>{
    res.render('chat/chat_index',{
        title:'聊天yemin'
    });
});

module.exports = router;