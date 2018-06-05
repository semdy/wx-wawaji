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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        _this.debug = false;
        _this.target = null;
        _this.isCollision = false;
        _this._boxStack = [];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Game.prototype.onAddToStage = function (event) {
        this.createWorldSystem();
        this.addElements();
        this.initEvents();
    };
    Game.prototype.createWorldSystem = function () {
        //创建world
        this.world = new p2.World({
            gravity: [0, 35]
        });
        //this.world.sleepMode = p2.World.BODY_SLEEPING;
        this.world.defaultContactMaterial.friction = 0.5;
        this.world.setGlobalStiffness(1000);
        //this.world.solver.frictionIterations = 10000;
    };
    Game.prototype.addElements = function () {
        this.createGround(688, 20, -20, 750, '地面');
        this.createGround(20, 950, -20, -200, '左墙面');
        this.createGround(20, 950, 648, -200, '右墙面');
        this.hooker = new Hooker();
        this.addChild(this.hooker);
        this.reStart();
    };
    Game.prototype.reStart = function () {
        var _this = this;
        this.isCollision = false;
        this.target = null;
        this.award = [];
        this.removeConstraint();
        var breadArgs = [
            { resId: "bread01_png", bundleId: 'bread01' }, { resId: "bread02_png", bundleId: 'bread02' },
            { resId: "bread03_png", bundleId: 'bread03' }, { resId: "bread04_png", bundleId: 'bread04' },
            { resId: "bread05_png", bundleId: 'bread05' }, { resId: "bread06_png", bundleId: 'bread06' },
            { resId: "bread07_png", bundleId: 'bread07' }, { resId: "bread08_png", bundleId: 'bread08' },
            { resId: "bread09_png", bundleId: 'bread09' }, { resId: "bread10_png", bundleId: 'bread10' }
        ];
        this.clearBodies();
        breadArgs.forEach(function (arg, i) {
            setTimeout(function () {
                _this._boxStack.push(_this.createBread(arg, Utils.range(100, 500)));
            }, i * 100);
        });
        //待所有面包都掉落了再移动抓子
        setTimeout(function () {
            _this.hooker.dispatchEvent(new egret.Event('reStartGame'));
        }, 2000);
    };
    Game.prototype.createConstraintBody = function () {
        var vec1 = [[24, 0], [35, 8], [15, 44], [19, 73], [47, 100], [38, 110], [4, 77], [0, 42]];
        var vec2 = [[14, 7], [24, 0], [47, 42], [47, 76], [7, 112], [0, 100], [32, 73], [33, 45]];
        if (!this.constraintBody) {
            this.constraintBody = this.createGround(50, 10, 120, 350, 'hit_body');
        }
        this.leftPaw = this.createPaw(vec1, 113, 258, '左臂');
        this.rightPaw = this.createPaw(vec2, 207, 258, '右臂');
    };
    Game.prototype.createGround = function (w, h, x, y, displayName) {
        var p2body = new p2.Body({
            mass: 1,
            position: Utils.getP2Pos(x + w / 2, y + h / 2),
            type: p2.Body.STATIC
        });
        p2body['displayName'] = displayName;
        this.world.addBody(p2body);
        var p2box = new p2.Box({
            width: Utils.extentP2(w),
            height: Utils.extentP2(h)
        });
        p2body.addShape(p2box);
        if (this.debug) {
            var shape = new egret.Shape();
            shape.graphics.beginFill(0x000000);
            shape.graphics.drawRect(0, 0, w, h);
            shape.graphics.endFill();
            shape.x = shape.width / 2;
            shape.y = shape.height / 2;
            shape.anchorOffsetX = shape.width / 2;
            shape.anchorOffsetY = shape.height / 2;
            p2body.displays = [shape];
            this.addChild(shape);
        }
        else {
            p2body.displays = [];
        }
        return p2body;
    };
    Game.prototype.createPaw = function (vecs, x, y, displayName) {
        var convex = new egret.Shape();
        convex.graphics.beginFill(0x000000);
        convex.graphics.moveTo(vecs[0][0], vecs[0][1]);
        vecs.slice(1).forEach(function (vec) {
            convex.graphics.lineTo(vec[0], vec[1]);
        });
        convex.graphics.endFill();
        convex.x = x + convex.width / 2;
        convex.y = y + convex.height / 2;
        convex.anchorOffsetX = convex.width / 2;
        convex.anchorOffsetY = convex.height / 2;
        var concaveBody = new p2.Body({
            mass: 0,
            position: Utils.getP2Pos(x + convex.width / 2, y + convex.height / 2),
            type: p2.Body.STATIC
        });
        var p2vecs = vecs.map(function (item) { return Utils.getP2Pos(item[0], item[1]); });
        concaveBody['displayName'] = displayName;
        concaveBody.fromPolygon(p2vecs);
        this.world.addBody(concaveBody);
        if (this.debug) {
            concaveBody.displays = [convex];
            this.addChild(convex);
        }
        else {
            concaveBody.displays = [];
        }
        return concaveBody;
    };
    Game.prototype.createBread = function (arg, startX, mass) {
        if (startX === void 0) { startX = 0; }
        if (mass === void 0) { mass = 2; }
        //添加长方形刚体的显示对象
        var display = new Bread(arg.resId);
        //面包开始掉落的初始位置
        var startY = -display.height;
        display.x = display.width / 2;
        display.y = startY + display.height / 2;
        display.anchorOffsetX = display.width / 2;
        display.anchorOffsetY = display.height / 2;
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xff0000);
        shape.graphics.drawRect(0, 0, display.width, display.height);
        shape.graphics.endFill();
        shape.x = display.x;
        shape.y = display.y;
        shape.anchorOffsetX = display.width / 2;
        shape.anchorOffsetY = display.height / 2;
        //添加长方形刚体
        var boxShape = new p2.Box({
            width: Utils.extentP2(display.width),
            height: Utils.extentP2(display.height)
        });
        var boxBody = new p2.Body({
            mass: mass,
            position: Utils.getP2Pos(startX + display.width / 2, startY),
            angularVelocity: 1,
            type: p2.Body.DYNAMIC
        });
        boxBody['displayName'] = arg.resId;
        boxBody['bundleId'] = arg.bundleId;
        boxBody.addShape(boxShape);
        this.world.addBody(boxBody);
        //同步display对象和p2对象
        boxBody.displays = [this.debug ? shape : display];
        this.addChild(this.debug ? shape : display);
        return boxBody;
    };
    Game.prototype.removePaws = function () {
        if (this.leftPaw) {
            this.world.removeBody(this.leftPaw);
        }
        if (this.rightPaw) {
            this.world.removeBody(this.rightPaw);
        }
        this.leftPaw = null;
        this.rightPaw = null;
    };
    Game.prototype.clearBodies = function () {
        var _this = this;
        this.removePaws();
        if (this.constraintBody) {
            this.world.removeBody(this.constraintBody);
            this.constraintBody = null;
        }
        this._boxStack.forEach(function (body) {
            _this.world.removeBody(body);
        });
        this._boxStack = [];
    };
    Game.prototype.updateDisplay = function () {
        var len = this.world.bodies.length;
        var crBody = this.constraintBody;
        var hooker = this.hooker;
        var leftLeg = this.hooker.leftLeg;
        var rightLeg = this.hooker.rightLeg;
        var paws = this.hooker.paws;
        var leftPaw = this.leftPaw;
        var rightPaw = this.rightPaw;
        if (crBody) {
            crBody.position[0] = Utils.extentP2(hooker.x + 87);
            crBody.position[1] = Utils.extentP2(paws.y + 295);
            if (leftPaw && rightPaw) {
                leftPaw.position[0] = Utils.extentP2(hooker.x + leftLeg['vx'] + leftLeg['vy'] + 35);
                leftPaw.position[1] = Utils.extentP2(paws.y + leftLeg['vy'] + 320);
                rightPaw.position[0] = Utils.extentP2(hooker.x + rightLeg['vx'] + 135);
                rightPaw.position[1] = Utils.extentP2(paws.y + rightLeg['vy'] + 320);
                leftPaw.angle = leftLeg.rotation / 180 * Math.PI;
                rightPaw.angle = rightLeg.rotation / 180 * Math.PI;
            }
        }
        for (var i = 0; i < len; i++) {
            var boxBody = this.world.bodies[i];
            var display = boxBody.displays[0];
            if (display) {
                display.x = Utils.extentEC(boxBody.position[0]);
                display.y = Utils.extentEC(boxBody.position[1]);
                display.rotation = boxBody.angle * 180 / Math.PI;
                //碰撞检测处于睡眠状态时加半透明标志一下
                if (this.debug) {
                    if (boxBody.sleepState === p2.Body.SLEEPING) {
                        display.alpha = 0.5;
                    }
                    else {
                        display.alpha = 1;
                    }
                }
            }
        }
    };
    Game.prototype.createConstraint = function (body) {
        var crBody = this.constraintBody;
        this.mouseConstraint = new p2.RevoluteConstraint(crBody, body, {
            worldPivot: [crBody.position[0], crBody.position[1]]
        });
        this.world.addConstraint(this.mouseConstraint);
    };
    Game.prototype.removeConstraint = function () {
        this.world.removeConstraint(this.mouseConstraint);
        this.mouseConstraint = null;
    };
    Game.prototype.release = function () {
        this.removeConstraint();
        this.removePaws();
        if (this.target) {
            this.target.displays[0].cry();
        }
    };
    Game.prototype.showResult = function (target) {
        if (target) {
            target.displays[0].stopSmile();
            console.log(target.displayName, target.bundleId);
        }
        else {
            console.log('未抓到任何面包');
        }
        if (this.award.length > 0) {
            this.parent['showAward'](this.award);
        }
        else {
            this.parent['showFail']();
        }
    };
    Game.prototype.getGameResult = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.game.result(target ? target.bundleId : "")];
                    case 1:
                        res = _a.sent();
                        this.award = res.income || [];
                        this.hooker.goUp();
                        //如果有抓中
                        if (target) {
                            //给抓中的面包一个笑脸
                            target.displays[0].smile();
                            //如果没有中奖，则给个概率是在底部释放还是抓子升起一半时释放
                            if (this.award.length === 0) {
                                if (Math.random() > .2) {
                                    setTimeout(function () {
                                        _this.release();
                                    }, 2500);
                                }
                                else {
                                    this.release();
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.initEvents = function () {
        var _this = this;
        var crBody = null;
        this.addEventListener(egret.Event.ENTER_FRAME, function () {
            this.world.step(1 / 60);
            this.updateDisplay();
        }, this);
        this.addEventListener("startGame", function (e) {
            if (this.hooker.isEnabled()) {
                this.hooker.goDown();
                this.hooker.dispatchEvent(new egret.Event('startGame'));
            }
        }, this);
        this.world.on('impact', function (e) {
            crBody = _this.constraintBody;
            if (crBody) {
                if (!_this.isCollision && (e.bodyA === crBody || e.bodyB === crBody)) {
                    _this.isCollision = true;
                    _this.target = e.bodyA === crBody ? e.bodyB : e.bodyA;
                    _this.hooker.stop();
                    _this.createConstraint(_this.target);
                    _this.dispatchEvent(new egret.Event('catch'));
                    console.log('hit -> ' + _this.target.displayName);
                }
            }
        });
        this.world.on('removeBody', function (e) {
            var displays = e.body.displays;
            for (var i = 0; i < displays.length; i++) {
                _this.removeChild(displays[i]);
            }
        });
        this.addEventListener('catch', function (e) {
            this.getGameResult(this.target);
        }, this);
        this.hooker.addEventListener('godown', function () {
            //钩子下降时创建爪子刚体
            this.createConstraintBody();
        }, this);
        //钩子下降到最底部且没有抓到任何物体
        this.hooker.addEventListener('reachdown', function () {
            this.getGameResult(null);
        }, this);
        this.hooker.addEventListener('goup', function () {
            //移除爪子刚体，防止其它面包被托起
            this.removePaws();
            //创建爪子，稳固已抓到的面包
            setTimeout(this.createConstraintBody.bind(this), 1000);
        }, this);
        //抓子升到顶部
        this.hooker.addEventListener('reachup', function () {
            this.removePaws();
            this.showResult(this.target);
            this.dispatchEvent(new egret.Event('reachup'));
        }, this);
    };
    return Game;
}(egret.Sprite));
__reflect(Game.prototype, "Game");
