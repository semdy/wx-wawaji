class AwardItem extends egret.Sprite {

    private data: any;
    public constructor(data: any) {
        super();

        this.data = data;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        let awardItemBg: egret.Bitmap = Utils.createBitmapByName('award_item_bg_png');
        this.addChild(awardItemBg);
        let title: egret.TextField = new egret.TextField();
        title.text = `${(this.data.params||{}).title} x ${this.data.amount}`;
        title.textColor = 0x762a1d;
        title.size = 28;
        title.bold = true;
        title.x = 190;
        title.y = 52;
        this.addChild(title);
    }

}