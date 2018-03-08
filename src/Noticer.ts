class Noticer extends egret.Sprite {

    private noticeText: egret.TextField;

    public constructor(x: number = 0, y: number = 0) {
        super();
        this.x = x;
        this.y = y;
        this.noticeText = new egret.TextField();
        this.noticeText.text = "恭喜xxx获得xxxx一个！";
        this.noticeText.size = 35;
        this.noticeText.width = 580;
        this.noticeText.textAlign = 'center';
        this.noticeText.textColor = 0xffffff;
        this.addChild(this.noticeText);
    }

}