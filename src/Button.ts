
interface ButtonConfigItem {
    texture: string
}

interface ButtonConfig {
    normal: ButtonConfigItem
    active?: ButtonConfigItem
}

class Button extends egret.Bitmap {

    private config: ButtonConfig;
    private normalTexture: egret.Texture;
    private activeTexture: egret.Texture;

    public constructor(config: ButtonConfig) {
        super();

        this.config = config;
        this.normalTexture = RES.getRes(config.normal.texture);
        this.activeTexture = RES.getRes(config.active.texture);
        this.texture = this.normalTexture;
        this.touchEnabled = true;

        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchStart, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(e: egret.TouchEvent): void {
        this.texture = this.activeTexture;
    }

    private onTouchEnd(e: egret.TouchEvent): void {
        this.texture = this.normalTexture;
    }
}