class Timer extends egret.Sprite {

    private count: number;
    private _countText: egret.TextField;
    private _timer: egret.TextField;

    public constructor(x: number = 0, y: number = 0) {
        super();

        this.x = x;
        this.y = y;

        this.count = 0;
        this._countText = new egret.TextField();
        this._countText.textColor = 0xffffff;
        this._countText.text = '免费：' + this.count + '次';
        this._countText.size = 26;
        this.addChild(this._countText);

        this._timer = new egret.TextField();
        this._timer.textColor = 0xffffff;
        this._timer.text = '00: 00: 00';
        this._timer.y = 35;
        this._timer.size = 28;
        this.addChild(this._timer);
    }

}