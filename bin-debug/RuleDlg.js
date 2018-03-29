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
var RuleDlg = (function (_super) {
    __extends(RuleDlg, _super);
    function RuleDlg(awardData) {
        if (awardData === void 0) { awardData = []; }
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    RuleDlg.prototype.onAddToStage = function (event) {
        var alphaMask = new egret.Shape();
        alphaMask.graphics.beginFill(0x000000, .8);
        alphaMask.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        alphaMask.graphics.endFill();
        this.addChild(alphaMask);
        var awardSpr = new egret.Sprite();
        awardSpr.x = 70;
        awardSpr.y = 406;
        var awardBg = Utils.createBitmapByName('rule_bg_png');
        awardSpr.addChild(awardBg);
        this.closeBtn = Utils.createBitmapByName('circle-close_png');
        this.closeBtn.x = 273;
        this.closeBtn.y = 590;
        awardSpr.addChild(this.closeBtn);
        this.closeBtn.touchEnabled = true;
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            //this.dispatchEvent(new egret.Event('close'));
            this.parent.removeChild(this);
        }, this);
        awardSpr.addChild(awardBg);
        var gameTitle = new egret.TextField();
        gameTitle.text = "抓面包机规则";
        gameTitle.size = 32;
        gameTitle.x = 202;
        gameTitle.y = 53;
        gameTitle.textColor = 0x333333;
        awardSpr.addChild(gameTitle);
        var rules = new egret.TextField();
        rules.text =
            "1、每次抓取消耗1次数，当次数不足时消耗2000麦点；\n" +
                "2、按下开始按键后，爪子会自动左右移动，直到按下抓取按键；\n" +
                "3、抓取按键被按下后，游戏次数将被消耗；\n" +
                "4、当爪子抓取后，伸回原来的位置时，爪子上仍抓着面包，则抓取成功；\n" +
                "5、抓取成功后，根据所抓面包来获得对应的奖励，具体信息可查看“奖励列表”；\n" +
                "6、普通会员每天可获得一次免费抓取，金麦会员每天可获得两次免费抓取；";
        rules.size = 26;
        rules.multiline = true;
        rules.width = 520;
        rules.lineSpacing = 20;
        rules.textColor = 0x7f7f7f;
        this.scrollView = new egret.ScrollView();
        this.scrollView.y = 134;
        this.scrollView.x = 55;
        this.scrollView.width = rules.width;
        this.scrollView.height = 320;
        this.scrollView.setContent(rules);
        awardSpr.addChild(this.scrollView);
        this.addChild(awardSpr);
    };
    return RuleDlg;
}(egret.Sprite));
__reflect(RuleDlg.prototype, "RuleDlg");
