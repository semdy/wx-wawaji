class PointDlg extends egret.Sprite {

    private button: egret.Shape;
    private closeBtn: egret.Bitmap;

    public constructor(awardData: Array<any> = []) {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        let alphaMask: egret.Shape = new egret.Shape();
        alphaMask.graphics.beginFill(0x000000, .8);
        alphaMask.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        alphaMask.graphics.endFill();
        this.addChild(alphaMask);

        let awardSpr: egret.Sprite = new egret.Sprite();
        awardSpr.x = 70;
        awardSpr.y = 406;

        let awardBg: egret.Bitmap = Utils.createBitmapByName('point_bg_png');
        awardSpr.addChild(awardBg);

        this.button = new egret.Shape();
        this.button.graphics.beginFill(0x000000, 0);
        this.button.graphics.drawRect(0, 0, 207, 68);
        this.button.graphics.endFill();
        this.button.y = 430;
        this.button.x = 204;
        this.button.touchEnabled = true;
        awardSpr.addChild(this.button);
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event: egret.TouchEvent) {
            this.dispatchEvent(new egret.Event('close'));
        }, this)


        this.closeBtn = Utils.createBitmapByName('circle-close_png');
        this.closeBtn.x = 273;
        this.closeBtn.y = 590;
        awardSpr.addChild(this.closeBtn);
        this.closeBtn.touchEnabled = true;
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event: egret.TouchEvent) {
            this.dispatchEvent(new egret.Event('close'));
        }, this)
        awardSpr.addChild(awardBg);

        this.addChild(awardSpr);
    }

}