var weixinApiService = (function(){

  const needApiNames: Array<string> = ['onMenuShareAppMessage','onMenuShareTimeline','hideOptionMenu',
    'showOptionMenu','scanQRCode','getLocation', 'chooseImage', 'uploadImage', 'previewImage'];

  const getQueryString = function(name: string): any {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]); return null;
  }

  let getPrivilegeParams = {
    param: window.location.href.split('#')[0],
    uname : getQueryString("uname") || 'zaofans',
    type : 'getJSSDKSign',
    __zaofans : true
  };

  let invokeQueue = [];
  let isWxReady = false;
  let configErrMsg = '';

  let debug = function(msg){
    console.info(msg);
  };

  let triggerReady = function(){
    for(var i=0; i<invokeQueue.length; i++){
      if( typeof invokeQueue[i] === 'function' ){
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
  let getWeixinApiPrivilege = function(){
    return new Promise(function(resolve, reject){
      Http.post(URLObj.weixinapiURL, getPrivilegeParams).then(function(retData){
        var code = retData.code;
        if(code === 0){
          var message = JSON.parse(retData.message);
          if(typeof message === 'object'){
            var jssdkSignature = {
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端debug出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: message.appId, // 必填，公众号的唯一标识
              timestamp: message.timestamp  , // 必填，生成签名的时间戳
              nonceStr: message.noncestr, // 必填，生成签名的随机串
              signature: message.signature,// 必填，签名，见附录1
              jsApiList: needApiNames // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            };
            resolve(jssdkSignature);
          } else {
            reject('message is null');
          }
        } else {
          reject('code is not 0,code is ' + code);
        }
      }, function(msg){
        reject(msg);
      });
    });
  };

  /**
   * 配置过程(这个过程之后才能调用api)
   * @param config 从微信服或得的配置对象
   */
  var config = function(config){
    config.debug = false;
    if(storage.local.get('weixinDebug')){
      config.debug = true;
    }
    wx.config(config);
  };

  /**
   * 调用微信api
   * @param apiName api名称
   * @param params 参数数组
   */
  var callWeixinApi =function(apiName: string, params?: object, deferred?: any){
    var args = [].slice.call(arguments, 1);
    var defer = deferred || new Promise(function(resolve, reject){
      if( configErrMsg ) reject(configErrMsg);
      wx.checkJsApi({
        jsApiList: needApiNames,
        success: function (res) {
          if(storage.local.get('weixinDebug')){
            alert('apply func :'+apiName+' params :'+JSON.stringify(params));
          }
          wx[apiName].apply(wx, args);
          resolve();
        }
      });
    });
    return defer;
  };

  function authorize(){
    debug('get wx config...');
    getWeixinApiPrivilege().then(function(jssdkConfig){
      config(jssdkConfig);
      debug('get wx config success: ' + JSON.stringify(jssdkConfig));
    }, function(msg){
      debug('get wx config error: ' + msg);
    });

    wx.ready(function(){
      triggerReady();

      if(configErrMsg) {
        debug(configErrMsg);
      } else {
        debug('wx config ready');
      }

    });

    wx.error(function(res){
      configErrMsg = 'wx ' + res.errMsg;
    });

  }

  /**
   * 暴露给外层的调用接口，封装了之后的具体实现过程
   * @param apiName api名称
   * @param params 参数数组
   */
  var exec = function(apiName, params){
    var isActionShare = (apiName === 'onMenuShareTimeline' || apiName === 'onMenuShareAppMessage');
    if(isWxReady){
      if(isActionShare){
        callWeixinApi('showOptionMenu');
      }
      return callWeixinApi(apiName, params);
    } else {
      var defer = new Promise(function(resolve, reject){
        invokeQueue.push(callWeixinApi.bind(null, apiName, params, defer));
        if(isActionShare){
          invokeQueue.push(callWeixinApi.bind(null, 'showOptionMenu'));
        }
      });
      return defer;
    }
  };

  return {
    getWeixinApiPrivilege : getWeixinApiPrivilege,
    exec : exec,
    config : config,
    callWeixinApi : callWeixinApi,
    debug : debug,
    authorize: authorize
  };

})();