class PrizeDlg extends egret.Sprite {

    private dataList: Array<object>;
    private scrollView: egret.ScrollView;
    private closeBtn: egret.Bitmap;

    public constructor() {
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

        let awardBg: egret.Bitmap = Utils.createBitmapByName('price_bg_png');
        awardSpr.addChild(awardBg);

        this.closeBtn = Utils.createBitmapByName('circle-close_png');
        this.closeBtn.x = 273;
        this.closeBtn.y = 590;
        awardSpr.addChild(this.closeBtn);
        this.closeBtn.touchEnabled = true;
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event: egret.TouchEvent) {
            this.visible = false;
        }, this)
        awardSpr.addChild(awardBg);

        

        this.scrollView = new egret.ScrollView();
        this.scrollView.y = 154;
        this.scrollView.x = 90;
        this.scrollView.width = 466;
        this.scrollView.height = 300;
        awardSpr.addChild(this.scrollView);

        this.addChild(awardSpr);
    }

    public setData(data: Array<any>): void {
        this.dataList = data;
        this.setScrollViewContent();
    }

    private setScrollViewContent() {
        let spr: egret.Sprite = new egret.Sprite();
        this.dataList.forEach((item, i) => {
            let prizeItem = new PrizeItem(item);
            prizeItem.y = 110 * i;
            spr.addChild(prizeItem);
        });
        //画一个透明的矩形，以处理scrollview空白区域无法拖动的问题
        let rect = new egret.Shape();
        rect.graphics.beginFill(0x000000, 0);
        rect.graphics.drawRect(0, 0, this.scrollView.width, 110*this.dataList.length);
        rect.graphics.endFill();
        spr.addChild(rect);
        this.scrollView.setContent(spr);
    }

}