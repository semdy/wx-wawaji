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
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.normalTexture = RES.getRes(config.normal.texture);
        _this.activeTexture = RES.getRes(config.active.texture);
        _this.texture = _this.normalTexture;
        _this.touchEnabled = true;
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchStart, _this);
        _this.addEventListener(egret.TouchEvent.TOUCH_END, _this.onTouchEnd, _this);
        return _this;
    }
    Button.prototype.onTouchStart = function (e) {
        this.texture = this.activeTexture;
    };
    Button.prototype.onTouchEnd = function (e) {
        this.texture = this.normalTexture;
    };
    return Button;
}(egret.Bitmap));
__reflect(Button.prototype, "Button");
