var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var service;
(function (service) {
    var common = (function () {
        function common() {
        }
        common.doRequest = function (url, data, sucFun, errFun) {
            Http.post("" + URLObj.siloHost + url + ".json", __assign({ auth: user.getAuthToken() }, data), { processData: false }).then(function (res) {
                if (res.protocError === 0) {
                    sucFun(res);
                }
                else {
                    if (res.protocError > 700 && res.protocError < 800) {
                        auth.refreshUserAuth(function () {
                            common.doRequest(url, data, sucFun, errFun);
                        });
                    }
                    else {
                        var errMsg = res.errorHint || "\u672A\u77E5\u9519\u8BEF(" + res.protocError + ")";
                        errFun(errMsg);
                        Utils.toast(errMsg);
                    }
                }
            }).catch(function (e) {
                var errMsg = '网络请求错误';
                errFun(errMsg);
                Utils.toast(errMsg);
            });
        };
        common.request = function (url, data) {
            return new Promise(function (resolve, reject) {
                common.doRequest(url, data, resolve, reject);
            });
        };
        return common;
    }());
    service.common = common;
    __reflect(common.prototype, "service.common");
    var asset = (function () {
        function asset() {
        }
        asset.drop = function () {
            return common.request('/asset/drop/2205', {
                dropKey: "drop-free-game-ticket",
                dropMore: [
                    "drop-free-game-ticket-daily",
                    "drop-free-game-ticket-daily-extra"
                ]
            });
        };
        asset.remain = function () {
            return common.request('/asset/remain/2211');
        };
        asset.exchange = function () {
            return common.request('/asset/exchange/2213', { exchange: "point-to-game-ticket" });
        };
        return asset;
    }());
    service.asset = asset;
    __reflect(asset.prototype, "service.asset");
    var user = (function () {
        function user() {
        }
        user.getAuthToken = function () {
            return storage.local.get('_authToken');
        };
        return user;
    }());
    service.user = user;
    __reflect(user.prototype, "service.user");
    var game = (function () {
        function game() {
        }
        game.result = function (bundleId) {
            return common.request('/game/result/2215', {
                game: "51021",
                params: {
                    option: bundleId
                }
            });
        };
        game.config = function () {
            return common.request('/game/config/2219', {
                game: "51021"
            });
        };
        game.log = function () {
            return common.request('/game/config/2217', {
                game: "51021"
            });
        };
        return game;
    }());
    service.game = game;
    __reflect(game.prototype, "service.game");
    var share = (function () {
        function share() {
        }
        share.post = function () {
            return common.request('/spread/107', {
                content: "MINI_GAME_51021"
            });
        };
        share.drop = function (spreadId, isNewUser) {
            return common.request('/spread/109', {
                spreadId: spreadId,
                isNewUser: isNewUser
            });
        };
        return share;
    }());
    service.share = share;
    __reflect(share.prototype, "service.share");
})(service || (service = {}));
