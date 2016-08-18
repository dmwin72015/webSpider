// (function (root) {
//     root = root || window;
//
//     function Bigpipe() {
//         this.callback = {};
//         this.templates = {};
//     }
//
//     Bigpipe.prototype.set = function (id, data) {
//         var callback = this.callback[key] || [];
//         for (var i = 0, len = callback.length; i < len; i++) {
//             callback[i].call(this, data);
//         }
//     };
//
//     Bigpipe.prototype.ready = function (id, cb) {
//         if (this.callback && cb) {
//             this.callback[id].push(cb);
//         } else {
//             this.callback && (this.callback[id] = []);
//         }
//     };
//     Bigpipe.prototype.render = function (name) {
//
//     };
//     root['bigpipe'] = new Bigpipe;
// }(window));

// define(function (require, exports, module) {
!function (root, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        // [1] CommonJS/Node.js
        // [1] 支持在module.exports.abc,或者直接exports.abc
        // var target = module['exports'] || exports; // module.exports is for Node.js
        // factory(root, target);
        console.log('CMD');
        module.exports = factory(root);
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        // [2] AMD 规范
        //define(['exports'],function(exports){
        //    exports.abc = function(){}
        //});
        console.log('AMD');
        define(['bigpipe'], factory(root));
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        console.log('None of either');
        factory(root);
    }
}(window, function (root, bigpipe) {
    bigpipe = bigpipe || {};
    function Bigpipe() {
        this.callback = {};
        this.templates = {};
    }

    Bigpipe.prototype.set = function (id, data) {
        var callback = this.callback[id] || [];
        for (var i = 0, len = callback.length; i < len; i++) {
            callback[i].call(this, data);
        }
    };

    Bigpipe.prototype.ready = function (id, cb) {
        if (this.callback && this.callback[id] && cb) {
            this.callback[id].push(cb);
        } else {
            this.callback && (this.callback[id] = [cb]);
        }
    };
    bigpipe = root.bigpipe = new Bigpipe;
    return bigpipe;
});
// });
bigpipe.ready('top10', function (data) {
    document.querySelector('#top10').innerHTML = data;
});
bigpipe.ready('labels', function (data) {
    document.querySelector('#labels').innerHTML = data;
});
bigpipe.ready('pic_sugg', function (data) {
    document.querySelector('#pic_sugg').innerHTML = data;
});
bigpipe.ready('article_list', function (data) {
    document.querySelector('#article_list').innerHTML = data;
});
