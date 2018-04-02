//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
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
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this._sourceReady = false;
        _this._authReady = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        var _this = this;
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        this._openid = Utils.getQueryString('openid');
        this.wxShare();
        this.loadResource().then(function (_) {
            _this._sourceReady = true;
            if (_this._authReady) {
                _this.runGame();
            }
        });
        auth.launch();
        auth.ready(function () {
            _this.AuthReady();
        });
    };
    Main.prototype.AuthReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service.asset.drop();
                        return [4 /*yield*/, service.asset.remain()];
                    case 1:
                        res = _a.sent();
                        this.remainAmount = this._getGameAmount(res.remain);
                        this._authReady = true;
                        if (this._sourceReady) {
                            this.runGame();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype._getGameAmount = function (remain) {
        var ret = remain.filter(function (item) { return item.config === 'GameTicket#24001'; });
        if (ret.length)
            return ret[0].amount;
        return 0;
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameLogs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.stage.removeChild(this.loadingView);
                        this.createGameScene();
                        return [4 /*yield*/, service.game.log()];
                    case 1:
                        gameLogs = _a.sent();
                        this.noticer.startChange(this._genNoticeData(gameLogs.income));
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype._genNoticeData = function (logs) {
        return logs.map(function (log) { return log.params.nick + "\u83B7\u5F97" + log.params.title + " x " + log.amount; });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("loading", 1)];
                    case 2:
                        _a.sent();
                        this.loadingView = new LoadingUI();
                        this.stage.addChild(this.loadingView);
                        return [4 /*yield*/, RES.loadGroup("preload", 0, this.loadingView)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.getOpenid = function () {
        return this._openid || storage.local.get('_openid');
    };
    Main.prototype.wxShare = function () {
        if (!Utils.isMiniGame()) {
            weixinApiService.authorize();
            weixinApiService.exec('onMenuShareTimeline', {
                title: '原麦山丘抓面包抽奖啦！',
                link: URLObj.shareUrl + "/share.html?redirectUri=" + encodeURIComponent(URLObj.weixinAuthUser),
                imgUrl: URLObj.Config.urls.shareIcon,
                success: function (res) {
                },
                cancel: function () {
                },
                fail: function (res) {
                    console.info('fail' + JSON.stringify(res));
                }
            });
            weixinApiService.exec('onMenuShareAppMessage', {
                title: '原麦山丘抓面包抽奖啦！',
                desc: '快来试试手气，赢取麦点优惠券！',
                link: URLObj.shareUrl + "/share.html?redirectUri=" + encodeURIComponent(URLObj.weixinAuthUser),
                imgUrl: URLObj.Config.urls.shareIcon,
                success: function () {
                },
                cancel: function () {
                }
            });
        }
    };
    Main.prototype.showAward = function (data) {
        this.setChildIndex(this.awardDlg, 100);
        this.awardDlg.setData(data);
        this.awardDlg.show();
    };
    Main.prototype.showFail = function () {
        this.setChildIndex(this.failDlg, 100);
        this.failDlg.visible = true;
    };
    Main.prototype.hideFail = function () {
        this.failDlg.visible = false;
    };
    Main.prototype.showPoint = function () {
        this.setChildIndex(this.pointDlg, 100);
        this.pointDlg.visible = true;
    };
    Main.prototype.hidePoint = function () {
        this.pointDlg.visible = false;
    };
    Main.prototype.showRule = function () {
        var ruleDlg = new RuleDlg();
        this.addChild(ruleDlg);
    };
    Main.prototype.showPrizes = function () {
        var _this = this;
        if (this.prizeDlg) {
            this.prizeDlg.visible = true;
        }
        else {
            this.giftBtn.touchEnabled = false;
            service.game.config().then(function (res) {
                _this.giftBtn.touchEnabled = true;
                _this.prizeDlg = new PrizeDlg();
                _this.addChild(_this.prizeDlg);
                _this.prizeDlg.setData(_this._genPrizeData(res.income));
            });
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        this.addElements();
        this.createButton();
        this.initEvents();
    };
    Main.prototype.addElements = function () {
        this.addChild(Utils.createBitmapByName('bg_jpg', 0, 0, this.stage.stageWidth, this.stage.stageHeight));
        this.addChild(Utils.createBitmapByName('main_title_png', 225, 156));
        this.ruleBtn = Utils.createBitmapByName('rule_btn_png', 0, 113);
        this.addChild(this.ruleBtn);
        this.ruleBtn.touchEnabled = true;
        this.ruleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            this.showRule();
        }, this);
        this.giftBtn = Utils.createBitmapByName('gift_btn_png', 648, 106);
        this.addChild(this.giftBtn);
        this.giftBtn.touchEnabled = true;
        this.giftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            this.showPrizes();
        }, this);
        this.noticer = new Noticer(90, 282);
        this.addChild(this.noticer);
        this.timer = new Timer(582, 1216);
        this.timer.setCount(this.remainAmount);
        this.addChild(this.timer);
        this.game = new Game(50, 368);
        var mask = new egret.Rectangle(-50, 0, this.stage.stageWidth, 765);
        this.game.mask = mask;
        this.addChild(this.game);
        this.addChild(Utils.createBitmapByName('top_roof_png', 0, 196));
        this.awardDlg = new AwardDlg();
        this.awardDlg.visible = false;
        this.addChild(this.awardDlg);
        this.failDlg = new FailDlg();
        this.failDlg.visible = false;
        this.addChild(this.failDlg);
        this.pointDlg = new PointDlg();
        this.pointDlg.visible = false;
        this.addChild(this.pointDlg);
    };
    Main.prototype._genPrizeData = function (data) {
        var ret = [];
        Object.keys(data).forEach(function (name) {
            ret.push({
                key: name,
                amount: data[name][0].amount,
                title: data[name][0].params.title
            });
        });
        return ret;
    };
    Main.prototype.createButton = function () {
        this.startButton = new Button({
            normal: {
                texture: 'button_go_png'
            },
            active: {
                texture: 'button_go_0_png'
            }
        });
        this.startButton.x = 213;
        this.startButton.y = 1162;
        this.addChild(this.startButton);
    };
    Main.prototype.initEvents = function () {
        this.startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            if (this.remainAmount > 0) {
                this.game.dispatchEvent(new egret.Event("startGame"));
            }
            else {
                this.showPoint();
            }
        }, this);
        this.game.addEventListener("reachup", function (e) {
            this.remainAmount = Math.max(0, --this.remainAmount);
            this.timer.setCount(this.remainAmount);
        }, this);
        this.awardDlg.addEventListener('close', function (e) {
            this.awardDlg.hide();
            this.game.reStart();
        }, this);
        this.failDlg.addEventListener('close', function (e) {
            this.hideFail();
            this.startButton.touchEnabled = true;
            this.game.reStart();
        }, this);
        this.pointDlg.addEventListener('close', function (e) {
            var _this = this;
            //用积分兑换游戏券
            this.pointDlg.button.touchEnabled = false;
            service.asset.exchange().then(function (res) {
                _this.pointDlg.button.touchEnabled = true;
                _this.remainAmount = _this._getGameAmount(res.income);
                if (_this.remainAmount > 0) {
                    _this.hidePoint();
                    _this.timer.setCount(_this.remainAmount);
                    _this.startButton.touchEnabled = true;
                    _this.game.reStart();
                }
                else {
                    Utils.toast("您当前积分不足，请去商城购物或者通过其它方式获取更多积分");
                }
            });
        }, this);
        document.addEventListener("touchstart", function (e) {
            e.preventDefault();
        }, false);
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
