module.exports = function (req, res, next) {
    res.end(req.path);
};