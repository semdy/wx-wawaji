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

    public constructor() {
        super();
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

        this.runGame().catch(e => {
            console.log(e);
        });


    }

    private async runGame() {
        await this.loadResource();
        this.createGameScene();
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private noticer: Noticer;
    private timer: Timer;
    private startButton: Button;
    private game: Game;

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
        this.addChild(Utils.createBitmapByName('bg_png', 0, 0, this.stage.stageWidth, this.stage.stageHeight));
        this.addChild(Utils.createBitmapByName('main_title_png', 225, 156));
        this.addChild(Utils.createBitmapByName('button_signin_png', 23, 133));
        this.addChild(Utils.createBitmapByName('button_gift_png', 648, 126));

        this.noticer = new Noticer(90, 276);
        this.addChild(this.noticer);

        this.timer = new Timer(586, 1196);
        this.addChild(this.timer);

        this.game = new Game(50, 366);
        let mask: egret.Rectangle = new egret.Rectangle(-50, 0, this.stage.stageWidth, 765);
        this.game.mask = mask;
        this.addChild(this.game);
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
        this.startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function(e) {
            this.game.dispatchEvent(new egret.Event("startGame"));
        }, this);

        this.startButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(e) {
            e.stopPropagation();
        }, this);

        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, function (e) {
            if (e.stageY < 200) {
                this.game.reStart();
            }
        }, this);

        document.addEventListener("touchstart",  e => {
            e.preventDefault();
        }, false);
    }
}