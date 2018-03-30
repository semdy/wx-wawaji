class PrizeItem extends egret.Sprite {

    private data: any;
    public constructor(data: any) {
        super();

        this.data = data;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        let awardItemBg: egret.Bitmap = Utils.createBitmapByName(`${this.data.key}_png`);
        awardItemBg.width *= 0.5; 
        awardItemBg.height *= 0.5; 
        awardItemBg.x = 15;
        awardItemBg.y = 23;
        this.addChild(awardItemBg);
        let title: egret.TextField = new egret.TextField();
        title.text = `${this.data.title} x ${this.data.amount}`;
        title.textColor = 0x333333;
        title.size = 28;
        title.x = 165;
        title.y = 53;
        this.addChild(title);

        let line: egret.Shape = new egret.Shape();
        line.graphics.beginFill(0xdddddd);
        line.graphics.drawRect(0, 0, 466, 2);
        line.graphics.endFill();
        line.y = 120;
        this.addChild(line);
    }

}