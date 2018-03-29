  var authReady = function () {};

  //进入web系统
  function gotoApp() {
    setTimeout(function () {
      authReady()
    });
  }

  //判断缓存是否存在（city,default address和user）
  function isCacheUseful(key) {
    var cache = storage.local.get(key);
    if (!cache) {
      return false;
    } else {
      return true;
    }
  }

  //getOpenidByCode接口同一个code只能调用一次, 第二次调用会报错
  function getOpenidByCode(code, callback) {
    Http.post(URLObj.weixinapiURL, {
      type: 'getOpenidByCode',
      uname: URLObj.Config.uname,
      param: code
    }).then(function (ret) {
      if (ret.code !== 0) {
        alert(ret.message);
      }
      callback(ret);
    }).catch(function (e) {
      callback(e);
    });
  }

  // 请求openID
  function requireOpenIdFromWeb(callback) {
    var openidFromUrl = Utils.getQueryString('openid');

    if (openidFromUrl) {
      storage.local.set("_openid", openidFromUrl);
      callback();
      return
    }

    var codeFromUrl = Utils.getQueryString('code');
    var codeFromLocal = storage.local.get('_code');

    debug('code:' + codeFromUrl);
    
    if (!codeFromUrl) {
      storage.local.remove('_openid');
      clearCache();
      console.error('缺少code');
      return
    }

    if (codeFromLocal !== codeFromUrl) {
      storage.local.remove('_openid');
      debug('requireOpenId...');
      getOpenidByCode(codeFromUrl, function (retStr) {
        if (typeof retStr.code === 'number' && retStr.code === 0) {
          var message = JSON.parse(retStr["message"]);
          var wxopenid = message["openid"];
          storage.local.set("_openid", wxopenid);
          storage.local.set("_code", codeFromUrl);
          callback();
        } else {
          Utils.toast(JSON.stringify(retStr));
        }
      });
    } else {
      callback();
    }
  }

  function requireOpenIdFromMiniGame(callback) {
    platform.login().then(function(res){
      if (res.code) {
        getOpenidByCode(res.code, function (retStr) {
          if (typeof retStr.code === 'number' && retStr.code === 0) {
            var message = JSON.parse(retStr["message"]);
            var wxopenid = message["openid"];
            storage.local.set("_openid", wxopenid);
            storage.local.set("_code", res.code);
            callback();
          } else {
            Utils.toast(JSON.stringify(retStr));
          }
        });
      } else {
        Utils.toast('登录失败！' + res.errMsg);
      }
    });
  }

  function requireOpenId(callback) {
    if (Utils.isMiniGame()) {
      requireOpenIdFromMiniGame(callback);
    } else {
      requireOpenIdFromWeb(callback);
    }
  }

  /**
   * 用户是否已经关注
   * @param wxid
   * @returns {*}
   */
  var isUserFollowed = function (callback) {

    var user = storage.local.get("_user");
    var _sessionid = storage.local.get("_sessionid");
    var _openid = storage.local.get("_openid");

    if (!user && !_sessionid) {
      debug('isUserFollowed...');
      Http.post(URLObj.weixinapiURL, {
        type: 'getWeixinUserInfo',
        uname: URLObj.Config.uname,
        param: _openid,
        __zaofans: true
      }).then(function (ret) {
        var isFollowed = (ret.data || {}).subscribe === 1 ? true : false;
        if (isFollowed) {
          storage.local.set("_isFollowed", isFollowed);
        }
        callback(isFollowed);
      }).catch(function () {
        callback(false);
      });
    } else {
      callback(true);
    }

  };

  //请求用户信息
  function requireUserInfo(callback) {
    if (!isCacheUseful('_user')) {
      debug('requireUserInfo...');
      Http.get(
        URLObj.Config.urls.userinfo,
        {
          uname: URLObj.Config.uname,
          __openid: storage.local.get("_openid")
        }).then(function (retStr) {
        storage.local.set("_user", retStr);
        storage.local.set("_sessionid", retStr.SESSIONID);
        callback();
      }).catch(function (e) {
        if (e.status === 456) {
          storage.local.clear();
        }
      });
    } else {
      callback();
    }
  }

  //请求用户token
  function requireUserAuth(callback, needRefetch?) {
    if(needRefetch) {
      storage.local.remove('_authToken');
    }
    if (!isCacheUseful('_authToken')) {
      debug('requireUserAuth...');
      var _sessionid = storage.local.get("_sessionid");
      Http.post(URLObj.Config.urls.authToken,
        {
          __sessionid: _sessionid
        }).then(function (ret) {
          if (ret.error !== 0) {
            var user = storage.local.get("user") || {};
            alert('用户凭证获取出错 error:' + ret.error + ", " + "userID:" + user.ID);
            debug(ret.errorHint);
          } else {
            storage.local.set("_authToken", ret.authToken);
            callback();
          }
        }, function (xhr) {
          alert("用户凭证获取失败 status:" + xhr.status + ", sessionid: " + _sessionid);
        });
    } else {
      callback();
    }
  }

  function refreshUserAuth(callback){
    requireUserAuth(callback, true);
  };

  function clearCache() {
    storage.local.remove("_isFollowed");
    storage.local.remove("_sessionid");
    storage.local.remove("_user");
  }

  function debug(msg) {
    console.log(msg);
  }

  function main() {
    if (!URLObj.Config.useCache) {
      clearCache();
    }
    requireOpenId(function () {
      isUserFollowed(function (isFollowed) {
        if (isFollowed) {
          requireUserInfo(function () {
            requireUserAuth(function(){
              gotoApp();
            });
          });
        } else {
          gotoApp();
        }
      });
    });
  }

  var auth = {
    launch: function(){
      if (!Utils.isMiniGame() && Utils.isWeiXin() && typeof window['WeixinJSBridge'] === "undefined") {
        document.addEventListener('WeixinJSBridgeReady', function wxReady() {
          main();
          document.removeEventListener('WeixinJSBridgeReady', wxReady, false);
        }, false);
      } else {
        main();
      }
    },
    ready: function (callback) {
      authReady = callback;
    }
  }
