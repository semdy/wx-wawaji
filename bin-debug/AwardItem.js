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
var AwardItem = (function (_super) {
    __extends(AwardItem, _super);
    function AwardItem(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    AwardItem.prototype.onAddToStage = function (event) {
        var awardItemBg = Utils.createBitmapByName('award_item_bg_png');
        this.addChild(awardItemBg);
        var title = new egret.TextField();
        title.text = (this.data.params || {}).title + " x " + this.data.amount;
        title.textColor = 0x762a1d;
        title.size = 28;
        title.bold = true;
        title.x = 190;
        title.y = 52;
        this.addChild(title);
    };
    return AwardItem;
}(egret.Sprite));
__reflect(AwardItem.prototype, "AwardItem");
