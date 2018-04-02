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
var Bread = (function (_super) {
    __extends(Bread, _super);
    function Bread(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.faceEven = false;
        //添加长方形刚体的显示对象
        var display = Utils.createBitmapByName(_this.name);
        display.width *= 0.6;
        display.height *= 0.6;
        _this.faceName = _this.getFaceName();
        _this.face = Utils.createBitmapByName(_this.faceName);
        _this.face.width = display.width * 0.6;
        _this.face.height = display.height * 0.6;
        _this.face.x = display.width / 2;
        _this.face.y = display.height / 2;
        _this.face.anchorOffsetX = _this.face.width / 2;
        _this.face.anchorOffsetY = _this.face.height / 2;
        _this.addChild(display);
        _this.addChild(_this.face);
        _this.timer = new egret.Timer(500);
        _this.timer.addEventListener(egret.TimerEvent.TIMER, function (event) {
            if (this.faceEven) {
                this.face.texture = RES.getRes("smile2_png");
            }
            else {
                this.face.texture = RES.getRes("smile1_png");
            }
            this.faceEven = !this.faceEven;
        }, _this);
        return _this;
    }
    Bread.prototype.getFaceName = function () {
        var faceNum = 1 + Math.floor(Math.random() * (10 - 1));
        return "face0" + faceNum + "_png";
    };
    Bread.prototype.smile = function () {
        this.face.texture = RES.getRes("smile1_png");
        this.face.rotation = -this.rotation;
        this.timer.start();
    };
    Bread.prototype.cry = function () {
        this.stopSmile();
        this.face.rotation = this.rotation;
        this.face.texture = RES.getRes(this.faceName);
    };
    Bread.prototype.stopSmile = function () {
        this.timer.reset();
    };
    return Bread;
}(egret.Sprite));
__reflect(Bread.prototype, "Bread");
