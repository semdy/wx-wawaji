class Game extends egret.Sprite {

    private debug: boolean;
    private leftPaw: p2.Body;
    private rightPaw: p2.Body;
    private constraintBody: p2.Body;
    private mouseConstraint: p2.RevoluteConstraint;
    private world: p2.World;
    private hooker: Hooker;
    private isCollision: boolean;
    private target: any;
    private _boxStack: Array<p2.Body>;

    public constructor(x: number = 0, y: number = 0) {
        super();

        this.x = x;
        this.y = y;

        this.debug = false;
        this.target = null;
        this.isCollision = false;

        this._boxStack = [];

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.createWorldSystem();
        this.addElements();
        this.initEvents();
    }

    private createWorldSystem(): void {
        //创建world
        this.world = new p2.World({
            gravity: [0, 35]
        });

        //this.world.sleepMode = p2.World.BODY_SLEEPING;
        this.world.defaultContactMaterial.friction = 0.5;
        this.world.setGlobalStiffness(1000);

        //this.world.solver.frictionIterations = 10000;
    }

    private addElements(): void {

        this.createGround(688, 20, -20, 750, '地面');
        this.createGround(20, 950, -20, -200, '左墙面');
        this.createGround(20, 950, 648, -200, '右墙面');

        this.hooker = new Hooker();
        this.addChild(this.hooker);

        this.reStart();

    }

    public reStart(): void {
        this.isCollision = false;
        this.target = null;

        let breadArgs: Array<object> = [
            {resId: "bread01_png", bundleId: 1}, {resId: "bread02_png", bundleId: 2},
            {resId: "bread03_png", bundleId: 3}, {resId: "bread04_png", bundleId: 4},
            {resId: "bread05_png", bundleId: 5}, {resId: "bread06_png", bundleId: 6},
            {resId: "bread07_png", bundleId: 7}, {resId: "bread08_png", bundleId: 8},
            {resId: "bread09_png", bundleId: 9}, {resId: "bread10_png", bundleId: 10}
        ];

        this.clearBodies();

        breadArgs.forEach((arg, i) => {
            setTimeout(() => {
                this._boxStack.push(this.createBread(arg, Utils.range(100,500)));
            }, i * 100);
        });

        this.hooker.dispatchEvent(new egret.Event('reStartGame'));
    }

    private createConstraintBody(): void {
        let vec1: Array<Array<number>> = [[24, 0], [35, 8], [15, 44], [19, 73], [47, 100], [38, 110], [4, 77], [0, 42]];
        let vec2: Array<Array<number>> = [[14, 7], [24, 0], [47, 42], [47, 76], [7, 112], [0, 100], [32, 73], [33, 45]];
        if (!this.constraintBody) {
            this.constraintBody = this.createGround(50, 10, 120, 350, 'hit_body');
        }
        this.leftPaw = this.createPaw(vec1, 113, 258, '左臂');
        this.rightPaw = this.createPaw(vec2, 207, 258, '右臂');
    }

    private createGround(w: number, h: number, x: number, y: number, displayName: string): p2.Body {
        let p2body: p2.Body = new p2.Body(
            {
                mass: 1,
                position: Utils.getP2Pos(x + w / 2, y + h / 2),
                type: p2.Body.STATIC
            }
        );
        p2body['displayName'] = displayName;
        this.world.addBody(p2body);

        let p2box: p2.Box = new p2.Box(
            {
                width: Utils.extentP2(w),
                height: Utils.extentP2(h)
            }
        );
        p2body.addShape(p2box);

        if (this.debug) {
            let shape: egret.Shape = new egret.Shape();
            shape.graphics.beginFill(0x000000);
            shape.graphics.drawRect(0, 0, w, h);
            shape.graphics.endFill();
            shape.x = shape.width / 2;
            shape.y = shape.height / 2;
            shape.anchorOffsetX = shape.width / 2;
            shape.anchorOffsetY = shape.height / 2;
            p2body.displays = [shape];

            this.addChild(shape);
        } else {
            p2body.displays = [];
        }

        return p2body;
    }

    private createPaw(vecs: Array<Array<number>>, x: number, y: number, displayName: string): p2.Body {
        let convex: egret.Shape = new egret.Shape();
        convex.graphics.beginFill(0x000000);
        convex.graphics.moveTo(vecs[0][0], vecs[0][1]);
        vecs.slice(1).forEach(vec => {
            convex.graphics.lineTo(vec[0], vec[1]);
        });
        convex.graphics.endFill();
        convex.x = x + convex.width / 2;
        convex.y = y + convex.height / 2;
        convex.anchorOffsetX = convex.width / 2;
        convex.anchorOffsetY = convex.height / 2;

        let concaveBody: p2.Body = new p2.Body({
            mass: 0,
            position: Utils.getP2Pos(x + convex.width / 2, y + convex.height / 2),
            type: p2.Body.STATIC
        });

        let p2vecs: Array<Array<number>> = vecs.map(item => Utils.getP2Pos(item[0], item[1]));

        concaveBody['displayName'] = displayName;
        concaveBody.fromPolygon(p2vecs);
        this.world.addBody(concaveBody);

        if (this.debug) {
            concaveBody.displays = [convex];
            this.addChild(convex);
        } else {
            concaveBody.displays = [];
        }

        return concaveBody;
    }

    private createBread(arg: object, startX: number = 0, mass: number = 2): p2.Body {

        //添加长方形刚体的显示对象
        let display: egret.Bitmap = Utils.createBitmapByName(arg.resId);
        display.width = display.width * 0.6;
        display.height = display.height * 0.6;

        //面包开始掉落的初始位置
        let startY = -display.height;

        display.x = display.width / 2;
        display.y =  startY + display.height / 2;
        display.anchorOffsetX = display.width / 2;
        display.anchorOffsetY = display.height / 2;

        let shape: egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0xff0000);
        shape.graphics.drawRect(0, 0, display.width, display.height);
        shape.graphics.endFill();
        shape.x = display.x;
        shape.y = display.y;
        shape.anchorOffsetX = display.width / 2;
        shape.anchorOffsetY = display.height / 2;

        //添加长方形刚体
        let boxShape: p2.Box = new p2.Box(
            {
                width: Utils.extentP2(display.width),
                height: Utils.extentP2(display.height)
            }
        );

        let boxBody: p2.Body = new p2.Body(
            {
                mass: mass,
                position: Utils.getP2Pos(startX + display.width / 2, startY),
                angularVelocity: 1,
                type: p2.Body.DYNAMIC
            }
        );

        boxBody['displayName'] = display.name;
        boxBody['bundleId'] = arg['bundleId'];
        boxBody.addShape(boxShape);
        this.world.addBody(boxBody);
        //同步display对象和p2对象
        boxBody.displays = [this.debug ? shape : display];
        this.addChild(this.debug ? shape : display);

        return boxBody
    }

    private removePaws(): void {
        if (this.leftPaw) {
            this.world.removeBody(this.leftPaw);
        }
        if (this.rightPaw) {
            this.world.removeBody(this.rightPaw);
        }
        this.leftPaw = null;
        this.rightPaw = null;
    }

    private clearBodies(): void {
        this.removePaws();

        if (this.constraintBody) {
            this.world.removeBody(this.constraintBody);
            this.constraintBody = null;
        }

        this._boxStack.forEach(body => {
            this.world.removeBody(body);
        });

        this._boxStack = [];
    }

    private updateDisplay(): void {
        let len = this.world.bodies.length;
        let crBody = this.constraintBody;
        let hooker = this.hooker;
        let leftLeg = this.hooker.leftLeg;
        let rightLeg = this.hooker.rightLeg;
        let paws = this.hooker.paws;
        let leftPaw = this.leftPaw;
        let rightPaw = this.rightPaw;

        if (crBody) {
            crBody.position[0] = Utils.extentP2(hooker.x + 87);
            crBody.position[1] = Utils.extentP2(paws.y + 295);
            if (leftPaw && rightPaw) {
                leftPaw.position[0] = Utils.extentP2(hooker.x + leftLeg['vx'] + leftLeg['vy'] + 35);
                leftPaw.position[1] = Utils.extentP2(paws.y + leftLeg['vy'] + 320);
                rightPaw.position[0] = Utils.extentP2(hooker.x + rightLeg['vx'] + 135);
                rightPaw.position[1] = Utils.extentP2(paws.y + rightLeg['vy'] + 320);
                leftPaw.angle = leftLeg.rotation / 180 * Math.PI;
                rightPaw.angle = rightLeg.rotation / 180 * Math.PI;
            }
        }

        for (let i = 0; i < len; i++) {
            let boxBody = this.world.bodies[i];
            let display = boxBody.displays[0];
            if (display) {
                display.x = Utils.extentEC(boxBody.position[0]);
                display.y = Utils.extentEC(boxBody.position[1]);
                display.rotation = boxBody.angle * 180 / Math.PI;
                if (boxBody.displayName === '左臂'){
                    console.log(boxBody.position[0])
                    console.log(display.x,leftLeg.x)
                }
                //碰撞检测处于睡眠状态时加半透明标志一下
                if (this.debug) {
                    if (boxBody.sleepState === p2.Body.SLEEPING) {
                        display.alpha = 0.5;
                    }
                    else {
                        display.alpha = 1;
                    }
                }
            }
        }
    }

    private createConstraint(body): void {
        let crBody = this.constraintBody;
        this.mouseConstraint = new p2.RevoluteConstraint(crBody, body, {
            worldPivot: [crBody.position[0], crBody.position[1]]
        });
        this.world.addConstraint(this.mouseConstraint);
    }

    private removeConstraint(): void {
        this.world.removeConstraint(this.mouseConstraint);
        this.mouseConstraint = null;
    }

    private showResult(target): void {
        if (target) {
            console.log(target.displayName, target.bundleId);
        } else {
            console.log('未抓到任何面包');
        }
    }

    private initEvents(): void {
        let crBody = null;

        this.addEventListener(egret.Event.ENTER_FRAME, function () {
            this.world.step(1 / 60);
            this.updateDisplay();
        }, this);

        this.addEventListener("startGame", function (e) {
            this.hooker.goDown();
            this.hooker.dispatchEvent(new egret.Event('startGame'));
        }, this);

        this.world.on('impact', e => {
            crBody = this.constraintBody;
            if (crBody) {
                if (!this.isCollision && (e.bodyA === crBody || e.bodyB === crBody)) {
                    this.isCollision = true;
                    this.target = e.bodyA === crBody ? e.bodyB : e.bodyA;
                    this.hooker.stop();
                    this.createConstraint(this.target);
                    console.log('hit -> ' + this.target.displayName);
                }
            }
        });

        this.world.on('removeBody', e => {
            let displays = e.body.displays;
            for (let i = 0; i < displays.length; i++) {
                this.removeChild(displays[i]);
            }
        });

        this.hooker.addEventListener('godown', function () {
            //钩子下降时创建爪子刚体
            this.createConstraintBody();
        }, this);

        this.hooker.addEventListener('goup', function () {
            //移除爪子刚体，防止其它面包被托起
            this.removePaws();
            //创建爪子，稳固已抓到的面包
            setTimeout(this.createConstraintBody.bind(this), 1000);
        }, this);

        this.hooker.addEventListener('reachup', function () {
            this.removePaws();
            this.removeConstraint();
            this.showResult(this.target);
            console.log('reachup');
        }, this);
    }
}