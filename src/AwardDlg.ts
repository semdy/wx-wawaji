class AwardDlg extends egret.Sprite {

    private dataList: Array<object>;
    private scrollView: egret.ScrollView;
    private button: egret.Shape;
    private hint: egret.TextField;
    private awardSpr: egret.Sprite;

    public constructor(awardData: Array<any> = []) {
        super();
        this.dataList = awardData;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        let alphaMask: egret.Shape = new egret.Shape();
        alphaMask.graphics.beginFill(0x000000, .8);
        alphaMask.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        alphaMask.graphics.endFill();
        this.addChild(alphaMask);

        let awardSpr: egret.Sprite = new egret.Sprite();

        let awardBg: egret.Bitmap = Utils.createBitmapByName('award_bg_png');
        awardSpr.addChild(awardBg);

        this.hint = new egret.TextField();
        this.hint.text = '你可在个人中心-卡包中查看';
        this.hint.textColor = 0x333333;
        this.hint.size = 26;
        this.hint.x = 164;
        this.hint.y = 622;
        awardSpr.addChild(this.hint);

        this.button = new egret.Shape();
        this.button.graphics.beginFill(0x000000, 0);
        this.button.graphics.drawRect(0, 0, 208, 68);
        this.button.graphics.endFill();
        this.button.y = 704;
        this.button.x = 228;
        this.button.touchEnabled = true;
        awardSpr.addChild(this.button);
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event: egret.TouchEvent) {
            this.dispatchEvent(new egret.Event('close'));
        }, this)

        this.scrollView = new egret.ScrollView();
        this.scrollView.y = 425;
        this.scrollView.x = 95;
        this.scrollView.width = 474;
        this.scrollView.height = 260;
        awardSpr.addChild(this.scrollView);

        awardSpr.x = 40 + awardSpr.width/2;
        awardSpr.y = 150 + awardSpr.height/2;
        awardSpr.anchorOffsetX = awardSpr.width/2;
        awardSpr.anchorOffsetY = awardSpr.height/2;
        awardSpr.scaleX = 0.5;
        awardSpr.scaleY = 0.5;
        this.addChild(awardSpr);

        this.awardSpr = awardSpr;
    }

    public setData(awardData: Array<any>): void {
        this.dataList = awardData;
        this.setScrollViewContent();
    }

    public show(): void {
        this.visible = true;
        egret.Tween.get(this.awardSpr).to({scaleX: 1, scaleY: 1}, 500, egret.Ease.backOut);
    }

    public hide(): void {
        this.awardSpr.scaleX = 0.5;
        this.awardSpr.scaleY = 0.5;
        this.visible = false;
    }

    private setScrollViewContent() {
        this.scrollView.removeContent();
        this.scrollView.y = this.dataList.length === 1 ? 425 : 375;
        this.hint.y = this.dataList.length === 1 ? 622 : 657;

        let spr: egret.Sprite = new egret.Sprite();
        this.dataList.forEach((item, i) => {
            let awardItem = new AwardItem(item);
            awardItem.y = (175 + 6) * i;
            spr.addChild(awardItem);
        });
        this.scrollView.setContent(spr);
    }

}