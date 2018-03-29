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
var Hooker = (function (_super) {
    __extends(Hooker, _super);
    function Hooker(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        _this._canMove = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Hooker.prototype.onAddToStage = function (event) {
        this.paws = new egret.Sprite();
        this.leftLeg = Utils.createBitmapByName('left_leg_png');
        this.rightLeg = Utils.createBitmapByName('right_leg_png');
        this.leftLeg.x = 13 + this.leftLeg.width / 2;
        this.leftLeg.y = 254;
        this.leftLeg.anchorOffsetX = this.leftLeg.width / 2;
        this.rightLeg.x = 113 + this.rightLeg.width / 2;
        this.rightLeg.y = 254;
        this.rightLeg.anchorOffsetX = this.rightLeg.width / 2;
        this.leftLeg['vx'] = 0;
        this.leftLeg['vy'] = 0;
        this.rightLeg['vx'] = 0;
        this.rightLeg['vy'] = 0;
        this.paws.addChild(this.leftLeg);
        this.paws.addChild(this.rightLeg);
        this.paws.addChild(Utils.createBitmapByName('machine_02_png', 23, -400));
        this.addChild(this.paws);
        this.addChild(Utils.createBitmapByName('machine_top_png'));
        this.initEvents();
    };
    Hooker.prototype.goDown = function () {
        var _this = this;
        this.dispatchEvent(new egret.Event('godown'));
        egret.Tween.get(this.paws).to({ y: 380 }, 3000).call(function () {
            _this.dispatchEvent(new egret.Event('reachdown'));
            //setTimeout(() => this.goUp(), 800);
        });
        this.openLegs();
    };
    Hooker.prototype.goUp = function () {
        var _this = this;
        this.dispatchEvent(new egret.Event('close'));
        this.closeLegs(function () {
            _this.dispatchEvent(new egret.Event('goup'));
            egret.Tween.get(_this.paws).to({ y: 0 }, 3000).wait(300).call(function () {
                _this.dispatchEvent(new egret.Event('reachup'));
            });
        });
    };
    Hooker.prototype.stop = function () {
        egret.Tween.removeTweens(this.paws);
    };
    Hooker.prototype.openLegs = function () {
        egret.Tween.get(this.leftLeg).to({ vx: -30, rotation: 30 }, 1200);
        egret.Tween.get(this.rightLeg).to({ vx: 30, vy: -25, rotation: -27 }, 1200);
    };
    Hooker.prototype.closeLegs = function (callback) {
        egret.Tween.get(this.leftLeg).to({ vx: 0, rotation: 0 }, 1200);
        egret.Tween.get(this.rightLeg).to({ vx: 0, vy: 0, rotation: 0 }, 1200).call(callback, this);
    };
    Hooker.prototype.disable = function () {
        this._canMove = false;
    };
    Hooker.prototype.enable = function () {
        this._canMove = true;
    };
    Hooker.prototype.initEvents = function () {
        var _this = this;
        var isLeft = true;
        this.addEventListener(egret.Event.ENTER_FRAME, function () {
            if (this._canMove) {
                if (isLeft) {
                    this.x += 2;
                }
                if (!isLeft) {
                    this.x -= 2;
                }
                if (this.x > 482) {
                    isLeft = false;
                    this.x = 482;
                }
                if (this.x <= 0) {
                    isLeft = true;
                    this.x = 0;
                }
            }
        }, this);
        this.addEventListener("startGame", function (e) {
            _this.disable();
        }, this);
        this.addEventListener("reStartGame", function (e) {
            _this.enable();
        }, this);
        /* this.stage.touchEnabled = true;
         this.stage.on("touchstart", function(e){
           this._canMove = true;
           if(e.stageX > this.stage.width/2) {
             isLeft = true;
           } else {
             isLeft = false;
           }
         }, this);

         this.stage.on("touchend", function(e){
           this._canMove = false;
         }, this);*/
    };
    return Hooker;
}(egret.Sprite));
__reflect(Hooker.prototype, "Hooker");
