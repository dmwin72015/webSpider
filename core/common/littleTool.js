/**
 * @Author Dongmin
 * @Date 20116-06-23
 */
module.exports = {
    /**
     * 返回当前时间的年月日 时分秒的字符串，例如：201608081024213
     * 1-4位：年;5-6位：月;7-8位：日;9-10位：小时;11-12位：分钟;13-14位：秒;15-17位：毫秒
     * */
    randomName: function () {
        var oD = new Date;
        var year = oD.getFullYear(),
            month = oD.getMonth() + 1,
            day = oD.getDate(),
            hour = oD.getHours(),
            minute = oD.getMinutes(),
            second = oD.getSeconds(),
            msecond = oD.getMilliseconds();
        return '' + year + comp(month) + comp(day) + comp(hour) + comp(minute) + comp(second) + comp(msecond);
    },

    /**
     * 把小于9的数字转换成0*,例如  8->08
     * @param｛Number} num - 数字
     * @returns {String}
     * */
    comp:function (num) {
        return num > 9 ? num : '0' + num;
    }
};