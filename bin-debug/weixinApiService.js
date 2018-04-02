var weixinApiService = (function () {
    var needApiNames = ['onMenuShareAppMessage', 'onMenuShareTimeline', 'hideOptionMenu',
        'showOptionMenu', 'scanQRCode', 'getLocation', 'chooseImage', 'uploadImage', 'previewImage'];
    var getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null)
            return decodeURIComponent(r[2]);
        return null;
    };
    var getPrivilegeParams = {
        param: encodeURIComponent(window.location.href.split('#')[0]),
        uname: getQueryString("uname") || 'zaofans',
        type: 'getJSSDKSign',
        __zaofans: true
    };
    var invokeQueue = [];
    var isWxReady = false;
    var configErrMsg = '';
    var debug = function (msg) {
        console.info(msg);
    };
    var triggerReady = function () {
        for (var i = 0; i < invokeQueue.length; i++) {
            if (typeof invokeQueue[i] === 'function') {
                invokeQueue[i]();
            }
        }
        //reset queue
        invokeQueue = [];
        isWxReady = true;
    };
    /**
     * 从远程获取微信api权限config
     * @returns {*|r.promise|Function|promise}
     */
    var getWeixinApiPrivilege = function () {
        return new Promise(function (resolve, reject) {
            Http.post(URLObj.weixinapiURL, getPrivilegeParams).then(function (retData) {
                var code = retData.code;
                if (code === 0) {
                    var message = JSON.parse(retData.message);
                    if (typeof message === 'object') {
                        var jssdkSignature = {
                            debug: false,
                            appId: message.appId,
                            timestamp: message.timestamp,
                            nonceStr: message.noncestr,
                            signature: message.signature,
                            jsApiList: needApiNames // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        };
                        resolve(jssdkSignature);
                    }
                    else {
                        reject('message is null');
                    }
                }
                else {
                    reject('code is not 0,code is ' + code);
                }
            }, function (msg) {
                reject(msg);
            });
        });
    };
    /**
     * 配置过程(这个过程之后才能调用api)
     * @param config 从微信服或得的配置对象
     */
    var config = function (config) {
        config.debug = false;
        if (storage.local.get('weixinDebug')) {
            config.debug = true;
        }
        wx.config(config);
    };
    /**
     * 调用微信api
     * @param apiName api名称
     * @param params 参数数组
     */
    var callWeixinApi = function (apiName, params, deferred) {
        var args = [].slice.call(arguments, 1);
        var defer = deferred || new Promise(function (resolve, reject) {
            if (configErrMsg)
                reject(configErrMsg);
            wx.checkJsApi({
                jsApiList: needApiNames,
                success: function (res) {
                    if (storage.local.get('weixinDebug')) {
                        alert('apply func :' + apiName + ' params :' + JSON.stringify(params));
                    }
                    wx[apiName].apply(wx, args);
                    resolve();
                }
            });
        });
        return defer;
    };
    function authorize() {
        debug('get wx config...');
        getWeixinApiPrivilege().then(function (jssdkConfig) {
            config(jssdkConfig);
            debug('get wx config success: ' + JSON.stringify(jssdkConfig));
        }, function (msg) {
            debug('get wx config error: ' + msg);
        });
        wx.ready(function () {
            triggerReady();
            if (configErrMsg) {
                debug(configErrMsg);
            }
            else {
                debug('wx config ready');
            }
        });
        wx.error(function (res) {
            configErrMsg = 'wx ' + res.errMsg;
        });
    }
    /**
     * 暴露给外层的调用接口，封装了之后的具体实现过程
     * @param apiName api名称
     * @param params 参数数组
     */
    var exec = function (apiName, params) {
        var isActionShare = (apiName === 'onMenuShareTimeline' || apiName === 'onMenuShareAppMessage');
        if (isWxReady) {
            if (isActionShare) {
                callWeixinApi('showOptionMenu');
            }
            return callWeixinApi(apiName, params);
        }
        else {
            var defer = new Promise(function (resolve, reject) {
                invokeQueue.push(callWeixinApi.bind(null, apiName, params, defer));
                if (isActionShare) {
                    invokeQueue.push(callWeixinApi.bind(null, 'showOptionMenu'));
                }
            });
            return defer;
        }
    };
    return {
        getWeixinApiPrivilege: getWeixinApiPrivilege,
        exec: exec,
        config: config,
        callWeixinApi: callWeixinApi,
        debug: debug,
        authorize: authorize
    };
})();
