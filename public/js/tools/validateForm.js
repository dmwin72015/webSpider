define(function (require, exports, module) {
    var objectToString = Object.prototype.toString;

    var reName = /[\u4e00-\u9fa5\w]/g,
        rePsswd = /\w{8,16}/g,
        reEmail = /^\w+@\w+\.\w+$/g,
        reWeb = /^https?:\/\/\w+\..*/g;

    function addEvent(obj, sEv, handle) {
        obj.addEventListener(sEv, handle, false);
    }

    //*
    // 是否可以为空
    // 长度限制
    // 正则匹配
    // */

    /*
     * {
     *   selector:'',
     *   length:[5,20],
     *   reg:"" or //g,
     *   display:'你输入的{{fieldValue}} 太长|太短|不合法|不能为空',
     *   required:true
     * }
     *
     *
     * */
    function Validate(sform, fields) {
        //TODO 兼容性没有处理
        if (!Array.isArray(fields) && !fields.length) {
            return sform;
        }
        this.oForm = document.querySelector(sform);
        if (oForm instanceof HTMLElement && oForm.nodeType == 1) {
            this.fields = fields;
            this.sonObjs = [];
        } else {
            return
            return sform;
        }
    }

    Validate.prototype.init = function () {
        var arr = this.fields,
            oForm = this.oForm,
            aSons = this.sonObjs,
            i = 0,
            len = arr.length;

        for (; i < len; i++) {
            var result = oForm.querySelector(arr[i]['selector']);
            if (!result) {
                continue;
            }
            aSons.push(result);
        }
    };


    Validate.prototype.validate = function () {

    };


    function vali(oInput, reg) {
        var val = oInput.value;
        if(val){


        }else{

        }

    }


    module.exports = Validate;
});