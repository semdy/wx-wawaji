declare class weixinApiService {
    static getWeixinApiPrivilege(): Function;
    static exec(apiName: string, params: object): Function;
    static config(cfg: object): Function;
    static callWeixinApi(apiName: string, params: object, deferred?: Promise<any>): Function;
    static debug(msg: string): Function;
    static authorize(): Function;
}