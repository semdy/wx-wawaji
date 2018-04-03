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
            return decodeURIComponent(r[2]);
        return null;
    };
    Utils.toast = function (msg) {
        if (wx.showToast) {
            wx.showToast({ title: msg });
        }
        else {
            alert(msg);
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
    Utils.showQrcode = function () {
        var qrDialog = document.createElement("div");
        qrDialog.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.8);z-index:20000;';
        qrDialog.innerHTML = '<div style="position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);"><img src="resource/assets/qrcode.png"/></div>';
        document.body.appendChild(qrDialog);
    };
    Utils.factor = 50;
    return Utils;
}());
__reflect(Utils.prototype, "Utils");
