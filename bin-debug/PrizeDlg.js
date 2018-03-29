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
var PrizeDlg = (function (_super) {
    __extends(PrizeDlg, _super);
    function PrizeDlg() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    PrizeDlg.prototype.onAddToStage = function (event) {
        var alphaMask = new egret.Shape();
        alphaMask.graphics.beginFill(0x000000, .8);
        alphaMask.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        alphaMask.graphics.endFill();
        this.addChild(alphaMask);
        var awardSpr = new egret.Sprite();
        awardSpr.x = 70;
        awardSpr.y = 406;
        var awardBg = Utils.createBitmapByName('price_bg_png');
        awardSpr.addChild(awardBg);
        this.closeBtn = Utils.createBitmapByName('circle-close_png');
        this.closeBtn.x = 273;
        this.closeBtn.y = 590;
        awardSpr.addChild(this.closeBtn);
        this.closeBtn.touchEnabled = true;
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            this.visible = false;
        }, this);
        awardSpr.addChild(awardBg);
        this.scrollView = new egret.ScrollView();
        this.scrollView.y = 154;
        this.scrollView.x = 90;
        this.scrollView.width = 466;
        this.scrollView.height = 300;
        awardSpr.addChild(this.scrollView);
        this.addChild(awardSpr);
    };
    PrizeDlg.prototype.setData = function (data) {
        this.dataList = data;
        this.setScrollViewContent();
    };
    PrizeDlg.prototype.setScrollViewContent = function () {
        var spr = new egret.Sprite();
        this.dataList.forEach(function (item, i) {
            var prizeItem = new PrizeItem(item);
            prizeItem.y = 110 * i;
            spr.addChild(prizeItem);
        });
        this.scrollView.setContent(spr);
    };
    return PrizeDlg;
}(egret.Sprite));
__reflect(PrizeDlg.prototype, "PrizeDlg");
