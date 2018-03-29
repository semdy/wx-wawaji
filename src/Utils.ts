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

    public static getQueryString(name: string): string {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]); return null;
    }

    public static toast(msg: string): void {
        if (wx.showToast) {
            wx.showToast({title: msg});
        } else {
            console.error(msg);
        }
    }

    public static isWeiXin(): boolean {
        var ua = window.navigator.userAgent;
        if (/MicroMessenger/.test(ua)) {
          return true;
        } else {
          return false;
        }
    }
    
    public static  isMiniGame(): boolean {
        var ua = window.navigator.userAgent;
        if (/MicroMessenger\/[\d.\d]+ MiniGame/.test(ua)) {
          return true;
        } else {
          return false;
        }
    }
}