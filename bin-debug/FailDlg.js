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
var FailDlg = (function (_super) {
    __extends(FailDlg, _super);
    function FailDlg(awardData) {
        if (awardData === void 0) { awardData = []; }
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    FailDlg.prototype.onAddToStage = function (event) {
        var alphaMask = new egret.Shape();
        alphaMask.graphics.beginFill(0x000000, .8);
        alphaMask.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        alphaMask.graphics.endFill();
        this.addChild(alphaMask);
        var awardSpr = new egret.Sprite();
        awardSpr.x = 70;
        awardSpr.y = 406;
        var awardBg = Utils.createBitmapByName('fail_bg_png');
        awardSpr.addChild(awardBg);
        this.button = new egret.Shape();
        this.button.graphics.beginFill(0x000000, 0);
        this.button.graphics.drawRect(0, 0, 207, 68);
        this.button.graphics.endFill();
        this.button.y = 430;
        this.button.x = 204;
        this.button.touchEnabled = true;
        awardSpr.addChild(this.button);
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            this.dispatchEvent(new egret.Event('close'));
        }, this);
        this.closeBtn = Utils.createBitmapByName('circle-close_png');
        this.closeBtn.x = 273;
        this.closeBtn.y = 590;
        awardSpr.addChild(this.closeBtn);
        this.closeBtn.touchEnabled = true;
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            this.dispatchEvent(new egret.Event('close'));
        }, this);
        awardSpr.addChild(awardBg);
        this.addChild(awardSpr);
    };
    return FailDlg;
}(egret.Sprite));
__reflect(FailDlg.prototype, "FailDlg");
