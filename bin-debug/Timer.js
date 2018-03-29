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
var Timer = (function (_super) {
    __extends(Timer, _super);
    function Timer(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        _this.count = 0;
        _this._countText = new egret.TextField();
        _this._countText.textColor = 0xffffff;
        _this._countText.text = "\u5269\u4F59:" + _this.count + "\u6B21";
        _this._countText.size = 26;
        _this.addChild(_this._countText);
        return _this;
    }
    Timer.prototype.setCount = function (count) {
        this.count = count;
        this._countText.text = "\u5269\u4F59:" + this.count + "\u6B21";
    };
    return Timer;
}(egret.Sprite));
__reflect(Timer.prototype, "Timer");
