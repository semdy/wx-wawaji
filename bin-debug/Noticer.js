var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Noticer = (function (_super) {
    __extends(Noticer, _super);
    function Noticer(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        _this.noticeText = new egret.TextField();
        _this.noticeText.text = "恭喜xxx获得xxxx一个！";
        _this.noticeText.size = 35;
        _this.noticeText.width = 580;
        _this.noticeText.textAlign = 'center';
        _this.noticeText.textColor = 0xffffff;
        _this.addChild(_this.noticeText);
        return _this;
    }
    return Noticer;
}(egret.Sprite));
__reflect(Noticer.prototype, "Noticer");
