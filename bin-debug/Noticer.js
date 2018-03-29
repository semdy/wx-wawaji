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
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Noticer.prototype.onAddToStage = function (event) {
        this.noticeText = new egret.TextField();
        this.noticeText.text = '';
        this.noticeText.size = 35;
        this.noticeText.width = 580;
        this.noticeText.textAlign = 'center';
        this.noticeText.textColor = 0xffffff;
        this.addChild(this.noticeText);
    };
    Noticer.prototype.startChange = function (result) {
        var _this = this;
        var textfield = this.noticeText;
        var count = -1;
        var change = function () {
            count++;
            if (count >= result.length) {
                count = 0;
            }
            var textFlow = result[count];
            textfield.text = textFlow;
            var tw = egret.Tween.get(textfield);
            tw.to({ alpha: 1 }, 200);
            tw.wait(2000);
            tw.to({ alpha: 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    return Noticer;
}(egret.Sprite));
__reflect(Noticer.prototype, "Noticer");
