class Noticer extends egret.Sprite {

    private noticeText: egret.TextField;

    public constructor(x: number = 0, y: number = 0) {
        super();
        this.x = x;
        this.y = y;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.noticeText = new egret.TextField();
        this.noticeText.text = '';
        this.noticeText.size = 35;
        this.noticeText.width = 580;
        this.noticeText.textAlign = 'center';
        this.noticeText.textColor = 0xffffff;
        this.addChild(this.noticeText);
    }

    public startChange(result: Array<any>): void {
        let textfield = this.noticeText;
        let count = -1;
        let change = () => {
            count++;
            if (count >= result.length) {
                count = 0;
            }
            let textFlow = result[count];

            textfield.text = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ alpha: 1 }, 200);
            tw.wait(2000);
            tw.to({ alpha: 0 }, 200);
            tw.call(change, this);
        };

        change();
    }

}