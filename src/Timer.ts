class Timer extends egret.Sprite {

    private count: number;
    private _countText: egret.TextField;

    public constructor(x: number = 0, y: number = 0) {
        super();

        this.x = x;
        this.y = y;

        this.count = 0;
        this._countText = new egret.TextField();
        this._countText.textColor = 0xffffff;
        this._countText.text = `剩余:${this.count}次`;
        this._countText.size = 26;
        this.addChild(this._countText);
    }

    public setCount(count: number): void {
        this.count = count;
        this._countText.text = `剩余:${this.count}次`;
    }

}