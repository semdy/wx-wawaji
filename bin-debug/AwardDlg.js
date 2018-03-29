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
var AwardDlg = (function (_super) {
    __extends(AwardDlg, _super);
    function AwardDlg(awardData) {
        if (awardData === void 0) { awardData = []; }
        var _this = _super.call(this) || this;
        _this.dataList = awardData;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    AwardDlg.prototype.onAddToStage = function (event) {
        var alphaMask = new egret.Shape();
        alphaMask.graphics.beginFill(0x000000, .8);
        alphaMask.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        alphaMask.graphics.endFill();
        this.addChild(alphaMask);
        var awardSpr = new egret.Sprite();
        awardSpr.x = 40;
        awardSpr.y = 150;
        var awardBg = Utils.createBitmapByName('award_bg_png');
        awardSpr.addChild(awardBg);
        this.hint = new egret.TextField();
        this.hint.text = '你可在个人中心-卡包中查看';
        this.hint.textColor = 0x333333;
        this.hint.size = 26;
        this.hint.x = 164;
        this.hint.y = 622;
        awardSpr.addChild(this.hint);
        this.button = new egret.Shape();
        this.button.graphics.beginFill(0x000000, 0);
        this.button.graphics.drawRect(0, 0, 208, 68);
        this.button.graphics.endFill();
        this.button.y = 704;
        this.button.x = 228;
        this.button.touchEnabled = true;
        awardSpr.addChild(this.button);
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            this.dispatchEvent(new egret.Event('close'));
        }, this);
        this.scrollView = new egret.ScrollView();
        this.scrollView.y = 425;
        this.scrollView.x = 95;
        this.scrollView.width = 474;
        this.scrollView.height = 260;
        awardSpr.addChild(this.scrollView);
        this.addChild(awardSpr);
    };
    AwardDlg.prototype.setData = function (awardData) {
        this.dataList = awardData;
        this.setScrollViewContent();
    };
    AwardDlg.prototype.setScrollViewContent = function () {
        this.scrollView.removeContent();
        this.scrollView.y = this.dataList.length === 1 ? 425 : 375;
        this.hint.y = this.dataList.length === 1 ? 622 : 657;
        var spr = new egret.Sprite();
        this.dataList.forEach(function (item, i) {
            var awardItem = new AwardItem(item);
            awardItem.y = (175 + 6) * i;
            spr.addChild(awardItem);
        });
        this.scrollView.setContent(spr);
    };
    return AwardDlg;
}(egret.Sprite));
__reflect(AwardDlg.prototype, "AwardDlg");
