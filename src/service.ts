module service {
    export class common {
        public static doRequest(url: string, data: object, sucFun: Function, errFun: Function): void {
            Http.post(`${URLObj.siloHost}${url}.json`, { auth: user.getAuthToken(), ...data }, { processData: false }).then((res) => {
                if (res.protocError === 0) {
                    sucFun(res);
                } else {
                    if (res.protocError > 700 && res.protocError < 800) { //auth过期重新刷auth接口
                        auth.refreshUserAuth(function () {
                            common.doRequest(url, data, sucFun, errFun);
                        });
                    } else {
                        const errMsg = res.errorHint || `未知错误(${res.protocError})`;
                        errFun(errMsg);
                        Utils.toast(errMsg);
                    }
                }
            }).catch((e) => {
                const errMsg = '网络请求错误';
                errFun(errMsg);
                Utils.toast(errMsg);
            });
        }

        public static request(url: string, data?: object): Promise<any> {
            return new Promise((resolve, reject) => {
                common.doRequest(url, data, resolve, reject);
            });
        }
    }
    export class asset {
        public static drop(): Promise<any> {
            return common.request('/asset/drop/2205', {
                dropKey: "drop-free-game-ticket",
                dropMore: [
                    "drop-free-game-ticket-daily",
                    "drop-free-game-ticket-daily-extra"
                ]
            });
        }
        public static remain(): Promise<any> {
            return common.request('/asset/remain/2211');
        }
        public static exchange(): Promise<any> {
            return common.request('/asset/exchange/2213', { exchange: "point-to-game-ticket" });
        }
    }
    export class user {
        public static getAuthToken(): string {
            return storage.local.get('_authToken');
        }
    }
    export class game {
        public static result(bundleId: string): Promise<any> {
            return common.request('/game/result/2215',
                {
                    game: "51021",
                    params: {
                        option: bundleId
                    }
                });
        }
        public static config(): Promise<any> {
            return common.request('/game/config/2219',
                {
                    game: "51021"
                });
        }
        public static log(): Promise<any> {
            return common.request('/game/config/2217',
                {
                    game: "51021"
                });
        }
    }
    export class share {
        public static post(): Promise<any> {
            return common.request('/spread/107',
                {
                    content: "MINI_GAME_51021"
                });
        }
        public static drop(spreadId: String, isNewUser: boolean): Promise<any> {
            return common.request('/spread/109',
                {
                    spreadId,
                    isNewUser
                });
        }
    }
}