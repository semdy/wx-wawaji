var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Utils = (function () {
    function Utils() {
    }
    Utils.createBitmapByName = function (name, x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        result.x = x;
        result.y = y;
        if (w !== undefined) {
            result.width = w;
        }
        if (h !== undefined) {
            result.height = h;
        }
        return result;
    };
    Utils.extentP2 = function (value) {
        return value / Utils.factor;
    };
    Utils.extentEC = function (value) {
        return value * Utils.factor;
    };
    Utils.getP2Pos = function (x, y) {
        return [x / Utils.factor, y / Utils.factor];
    };
    Utils.getECPos = function (x, y) {
        return [x * Utils.factor, y * Utils.factor];
    };
    ;
    Utils.range = function (min, max, needInt) {
        if (needInt === void 0) { needInt = false; }
        var randomNum = min + Math.random() * (max - min);
        var val;
        if (needInt) {
            val = Math.floor(randomNum);
        }
        else {
            val = randomNum;
        }
        return val;
    };
    ;
    Utils.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null)
            return unescape(r[2]);
        return null;
    };
    Utils.toast = function (msg) {
        if (wx.showToast) {
            wx.showToast({ title: msg });
        }
        else {
            console.error(msg);
        }
    };
    Utils.isWeiXin = function () {
        var ua = window.navigator.userAgent;
        if (/MicroMessenger/.test(ua)) {
            return true;
        }
        else {
            return false;
        }
    };
    Utils.isMiniGame = function () {
        var ua = window.navigator.userAgent;
        if (/MicroMessenger\/[\d.\d]+ MiniGame/.test(ua)) {
            return true;
        }
        else {
            return false;
        }
    };
    Utils.factor = 50;
    return Utils;
}());
__reflect(Utils.prototype, "Utils");
