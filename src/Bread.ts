class Bread extends egret.Sprite {

    public startY: number;
    private face: egret.Bitmap;
    private timer: egret.Timer;
    private faceEven: boolean;
    private faceName: string;

    public constructor(name: string) {
        super();
        this.name = name;
        this.faceEven = false;

        //添加长方形刚体的显示对象
        let display: egret.Bitmap = Utils.createBitmapByName(this.name);
        display.width *= 0.6;
        display.height *= 0.6;

        this.faceName = this.getFaceName();
        this.face = Utils.createBitmapByName(this.faceName);
        this.face.width = display.width * 0.6;
        this.face.height = display.height * 0.6;
        this.face.x = display.width/2;
        this.face.y = display.height/2;
        this.face.anchorOffsetX = this.face.width/2;
        this.face.anchorOffsetY = this.face.height/2;
        
        this.addChild(display);
        this.addChild(this.face);

        this.timer = new egret.Timer(500);
        this.timer.addEventListener(egret.TimerEvent.TIMER, function(event: egret.TimerEvent){
            if (this.faceEven) {
                this.face.texture = RES.getRes("smile2_png");
            } else {
                this.face.texture = RES.getRes("smile1_png");
            }
            this.faceEven = !this.faceEven;
        }, this);
    }

    private getFaceName(): string {
        let faceNum: number = 1 + Math.floor(Math.random()*(10 - 1));
        return `face0${faceNum}_png`;
    }

    public smile(): void {
        this.face.texture = RES.getRes("smile1_png");
        this.face.rotation = -this.rotation;
        this.timer.start();
    }

    public cry(): void {
        this.stopSmile();
        this.face.rotation = this.rotation;
        this.face.texture = RES.getRes(this.faceName);
    }

    public stopSmile(): void {
        this.timer.reset();
    }
}