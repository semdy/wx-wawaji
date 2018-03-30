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
var PrizeItem = (function (_super) {
    __extends(PrizeItem, _super);
    function PrizeItem(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    PrizeItem.prototype.onAddToStage = function (event) {
        var awardItemBg = Utils.createBitmapByName(this.data.key + "_png");
        awardItemBg.width *= 0.5;
        awardItemBg.height *= 0.5;
        awardItemBg.x = 15;
        awardItemBg.y = 23;
        this.addChild(awardItemBg);
        var title = new egret.TextField();
        title.text = this.data.title + " x " + this.data.amount;
        title.textColor = 0x333333;
        title.size = 28;
        title.x = 165;
        title.y = 53;
        this.addChild(title);
        var line = new egret.Shape();
        line.graphics.beginFill(0xdddddd);
        line.graphics.drawRect(0, 0, 466, 2);
        line.graphics.endFill();
        line.y = 120;
        this.addChild(line);
    };
    return PrizeItem;
}(egret.Sprite));
__reflect(PrizeItem.prototype, "PrizeItem");
