class Hooker extends egret.Sprite {

    public paws: egret.Sprite;
    public leftLeg: egret.Bitmap;
    public rightLeg: egret.Bitmap;
    private _canMove: boolean;

    public constructor(x: number = 0, y: number = 0) {
        super();

        this.x = x;
        this.y = y;
        this._canMove = true;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.paws = new egret.Sprite();
        this.leftLeg = Utils.createBitmapByName('left_leg_png');
        this.rightLeg = Utils.createBitmapByName('right_leg_png');

        this.leftLeg.x = 13 + this.leftLeg.width / 2;
        this.leftLeg.y = 254;
        this.leftLeg.anchorOffsetX = this.leftLeg.width / 2;

        this.rightLeg.x = 113 + this.rightLeg.width / 2;
        this.rightLeg.y = 254;
        this.rightLeg.anchorOffsetX = this.rightLeg.width / 2;

        this.leftLeg['vx'] = 0;
        this.leftLeg['vy'] = 0;
        this.rightLeg['vx'] = 0;
        this.rightLeg['vy'] = 0;
        this.paws.addChild(this.leftLeg);
        this.paws.addChild(this.rightLeg);
        this.paws.addChild(Utils.createBitmapByName('machine_02_png', 23, -400));
        this.addChild(this.paws);
        this.addChild(Utils.createBitmapByName('machine_top_png'));

        this.initEvents();
    }

    goDown(): void {
        this.dispatchEvent(new egret.Event('godown'));
        egret.Tween.get(this.paws).to({y: 380}, 3000).call(() => {
            setTimeout(() => this.goUp(), 800);
        });
        this.openLegs();
    }

    goUp(): void {
        this.dispatchEvent(new egret.Event('close'));
        this.closeLegs(() => {
            this.dispatchEvent(new egret.Event('goup'));
            egret.Tween.get(this.paws).to({y: 0}, 3000).call(() => {
                this.dispatchEvent(new egret.Event('reachup'));
            });
        });

    }

    stop(): void {
        egret.Tween.removeTweens(this.paws);
        setTimeout(() => this.goUp(), 800);
    }

    openLegs(): void {
        egret.Tween.get(this.leftLeg).to({vx: -30, rotation: 30}, 1200);
        egret.Tween.get(this.rightLeg).to({vx: 30, vy: -25, rotation: -27}, 1200);
    }

    closeLegs(callback): void {
        egret.Tween.get(this.leftLeg).to({vx: 0, rotation: 0}, 1200);
        egret.Tween.get(this.rightLeg).to({vx: 0, vy: 0, rotation: 0}, 1200).call(callback, this);
    }

    initEvents(): void {
        let isLeft = true;
        this.addEventListener(egret.Event.ENTER_FRAME, function () {
            if (this._canMove) {
                if (isLeft) {
                    this.x += 2;
                }

                if (!isLeft) {
                    this.x -= 2;
                }

                if (this.x > 490) {
                    isLeft = false;
                    this.x = 490
                }

                if (this.x <= 0) {
                    isLeft = true;
                    this.x = 0;
                }
            }
        }, this);

        this.addEventListener("startGame", e => {
            this._canMove = false;
        }, this);

        this.addEventListener("reStartGame", e => {
            this._canMove = true;
        }, this);

        /* this.stage.touchEnabled = true;
         this.stage.on("touchstart", function(e){
           this._canMove = true;
           if(e.stageX > this.stage.width/2) {
             isLeft = true;
           } else {
             isLeft = false;
           }
         }, this);

         this.stage.on("touchend", function(e){
           this._canMove = false;
         }, this);*/
    }
}