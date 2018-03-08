class Utils {
    private static factor = 50;
    public static createBitmapByName(name: string, x: number = 0, y: number = 0, w?: number, h?: number): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        result.x = x;
        result.y = y;
        if (w !== undefined) {
            result.width = w;
        }
        if (h !== undefined) {
            result.height = h;
        }
        return result;
    }

    public static extentP2(value: number): number {
        return value/Utils.factor;
    }

    public static extentEC(value: number): number {
        return value*Utils.factor;
    }

    public static getP2Pos(x: number, y: number): Array<number> {
        return [x/Utils.factor, y/Utils.factor];
    }

    public static getECPos(x: number, y: number): Array<number> {
        return [x*Utils.factor, y*Utils.factor];
    };

    public static range(min: number, max: number, needInt: boolean = false): number{
        let randomNum = min + Math.random()*(max - min);
        let val;
        if(needInt) {
            val = Math.floor(randomNum);
        } else {
            val = randomNum;
        }
        return val;
    };
}