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

class Main extends egret.DisplayObjectContainer {

    private noticer: Noticer;
    private timer: Timer;
    private startButton: Button;
    private _openid: string;
    private remainAmount: number;
    private awardDlg: AwardDlg;
    private failDlg: FailDlg;
    private pointDlg: PointDlg;
    public game: Game;
    private prizeDlg: PrizeDlg;
    private ruleBtn: egret.Bitmap;
    private giftBtn: egret.Bitmap;
    private loadingView: any;
    private _sourceReady: boolean;
    private _authReady: boolean;

    public constructor() {
        super();
        this._sourceReady = false;
        this._authReady = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        });

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        };

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        };

        this._openid = Utils.getQueryString('openid');

        this.wxShare();
        this.loadResource().then(() => {
            this._sourceReady = true;
            if (this._authReady) {
                this.runGame();
            }
        });

        auth.launch();
        auth.ready(() => {
            this.AuthReady();
        });
        auth.error(() => {
            Utils.showQrcode();
        });
    }

    private async AuthReady() {
        service.asset.drop();
        let res = await service.asset.remain();
        this.remainAmount = this._getGameAmount(res.remain);
        this._authReady = true;
        if (this._sourceReady) {
            this.runGame();
        }
    }

    private _getGameAmount(remain: Array<{ config: string, amount: number }>): number {
        let ret: Array<{ config: string, amount: number }> = remain.filter(item => item.config === 'GameTicket#24001');
        if (ret.length) return ret[0].amount;
        return 0;
    }

    private async runGame() {
        this.stage.removeChild(this.loadingView);
        this.createGameScene();
        /* await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo); */
        let gameLogs = await service.game.log();
        this.noticer.startChange(this._genNoticeData(gameLogs.income));
    }

    private _genNoticeData(logs: Array<any>): Array<string> {
        return logs.map(log => `${log.params.nick}获得${log.params.title} x ${log.amount}`);
    }

    private async loadResource() {
        try {
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("loading", 1);
            this.loadingView = new LoadingUI();
            this.stage.addChild(this.loadingView);
            await RES.loadGroup("preload", 0, this.loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private getOpenid(): string {
        return this._openid || storage.local.get('_openid');
    }

    private wxShare(): void {
        if (!Utils.isMiniGame()) {
            weixinApiService.authorize();
            weixinApiService.exec('onMenuShareTimeline', {
                title: '原麦山丘抓面包抽奖啦！',
                link: `${URLObj.shareUrl}/share.html?redirectUri=${encodeURIComponent(URLObj.weixinAuthUser)}`,
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
                link: `${URLObj.shareUrl}/share.html?redirectUri=${encodeURIComponent(URLObj.weixinAuthUser)}`,
                imgUrl: URLObj.Config.urls.shareIcon,
                success: function () {
                },
                cancel: function () {
                }
            });
        }
    }

    public showAward(data: Array<object>): void {
        this.setChildIndex(this.awardDlg, 100);
        this.awardDlg.setData(data);
        this.awardDlg.show();
    }

    public showFail(): void {
        this.setChildIndex(this.failDlg, 100);
        this.failDlg.visible = true;
    }

    public hideFail(): void {
        this.failDlg.visible = false;
    }

    public showPoint(): void {
        this.setChildIndex(this.pointDlg, 100);
        this.pointDlg.visible = true;
    }

    public hidePoint(): void {
        this.pointDlg.visible = false;
    }

    public showRule(): void {
        let ruleDlg: egret.Sprite = new RuleDlg();
        this.addChild(ruleDlg);
    }

    public showPrizes(): void {
        if (this.prizeDlg) {
            this.prizeDlg.visible = true;
        } else {
            this.giftBtn.touchEnabled = false;
            service.game.config().then(res => {
                this.giftBtn.touchEnabled = true;
                this.prizeDlg = new PrizeDlg();
                this.addChild(this.prizeDlg);
                this.prizeDlg.setData(this._genPrizeData(res.income));
            });
        }
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.addElements();
        this.createButton();
        this.initEvents();
    }

    private addElements(): void {
        this.addChild(Utils.createBitmapByName('bg_jpg', 0, 0, this.stage.stageWidth, this.stage.stageHeight));
        this.addChild(Utils.createBitmapByName('main_title_png', 225, 156));

        this.ruleBtn = Utils.createBitmapByName('rule_btn_png', 0, 113);
        this.addChild(this.ruleBtn);
        this.ruleBtn.touchEnabled = true;
        this.ruleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event: egret.TouchEvent) {
            this.showRule();
        }, this);

        this.giftBtn = Utils.createBitmapByName('gift_btn_png', 648, 106);
        this.addChild(this.giftBtn);
        this.giftBtn.touchEnabled = true;
        this.giftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event: egret.TouchEvent) {
            this.showPrizes();
        }, this);


        this.noticer = new Noticer(90, 282);
        this.addChild(this.noticer);

        this.timer = new Timer(582, 1216);
        this.timer.setCount(this.remainAmount);
        this.addChild(this.timer);

        this.game = new Game(50, 368);
        let mask: egret.Rectangle = new egret.Rectangle(-50, 0, this.stage.stageWidth, 765);
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
    }

    private _genPrizeData(data: object): Array<object> {
        let ret = [];
        Object.keys(data).forEach(name => {
            ret.push({
                key: name,
                amount: data[name][0].amount,
                title: data[name][0].params.title
            });
        });

        return ret;
    }

    private createButton(): void {
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
    }

    private initEvents(): void {
        this.startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            if (this.remainAmount > 0) {
                this.game.dispatchEvent(new egret.Event("startGame"));
            } else {
                this.showPoint();
            }
        }, this);

        this.game.addEventListener("reachup", function (e: egret.Event) {
            this.remainAmount = Math.max(0, --this.remainAmount);
            this.timer.setCount(this.remainAmount);
        }, this)

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
            //用麦点兑换游戏券
            this.pointDlg.button.touchEnabled = false;
            service.asset.exchange().then(res => {
                this.pointDlg.button.touchEnabled = true;
                this.remainAmount = this._getGameAmount(res.income);
                if (this.remainAmount > 0) {
                    this.hidePoint();
                    this.timer.setCount(this.remainAmount);
                    this.startButton.touchEnabled = true;
                    this.game.reStart();
                } else {
                    Utils.toast("您当前麦点不足，请去商城购物或者通过其它方式获取更多麦点");
                }
            })
        }, this);

        document.addEventListener("touchstart", e => {
            e.preventDefault();
        }, false);
    }
}