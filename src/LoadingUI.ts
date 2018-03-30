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

class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private textField: egret.TextField;

    private onAddToStage(event: egret.Event) {
        this.createView();
    }

    private createView(): void {
        let bg: egret.Bitmap = Utils.createBitmapByName('loading_pbg_jpg');
        this.addChild(bg);

        let dec: egret.Bitmap = Utils.createBitmapByName('loading_dec_png', 310, 0);
        this.addChild(dec);

        let barSpr: egret.Sprite = new egret.Sprite();
        barSpr.x = 134;
        barSpr.y = 645;
        let barBg: egret.Bitmap = Utils.createBitmapByName('loading_bg_png');
        barSpr.addChild(barBg);
        let bar: egret.Bitmap = Utils.createBitmapByName('loading_bar_png', 9, 7);
        barSpr.addChild(bar);

        let loadingText: egret.Bitmap = Utils.createBitmapByName('loading_png', 170, 14);
        barSpr.addChild(loadingText);

        this.textField = new egret.TextField();
        barSpr.addChild(this.textField);
        this.textField.textColor = 0xffffff;
        this.textField.strokeColor = 0x22712a;
        this.textField.stroke = 2;
        this.textField.size = 21;
        this.textField.x = 290;
        this.textField.y = 14;
        this.textField.textAlign = "center";
        this.addChild(barSpr);
    }

    public onProgress(current: number, total: number): void {
        this.textField.text = `${Math.floor(current/total*100)}%`;
    }
}
