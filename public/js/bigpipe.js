(function (root) {
    root = root || window;

    function Bigpipe() {
        this.callback = {};
        this.templates = {};
    }

    Bigpipe.prototype.set = function (id, data) {
        var callback = this.callback[key] || [];
        for (var i = 0, len = callback.length; i < len; i++) {
            callback[i].call(this, data);
        }
    };

    Bigpipe.prototype.ready = function (id, cb) {
        if (this.callback && cb) {
            this.callback[id].push(cb);
        } else {
            this.callback && (this.callback[id] = []);
        }
    };
    Bigpipe.prototype.render = function (name) {

    };
    root['bigpipe'] = new Bigpipe;
}(window));
(function (root, bp) {
    var _t = bp.templates || {};
    _t['index/foot'] = function () {
        var buf = [];
        buf.push('<div'),
        buf.push();


    }, _t['index/top10'] = function () {

    };

}(window, (window.bigpipe || {})));

