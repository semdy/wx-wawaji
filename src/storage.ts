var storage = (function () {
  var isLocalStorageSupported: boolean = function () {
    var testKey = 'test', storage = window.localStorage;
    try {
      storage.setItem(testKey, '1');
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }();

  var STORAGE_KEY: string = Utils.getQueryString("uname") || window.localStorage.getItem("wx_uname") || 'zaofans';

  function getKey(key): string {
    if (key === undefined || key === null || key === "") return key;
    return STORAGE_KEY + ":" + key;
  }

  var decode = function (s): string {
    return unRfc2068(decodeURIComponent(s.replace(/\+/g, ' ')));
  };

  var unRfc2068 = function (value): string {
    if (value.indexOf('"') === 0) {
      value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    return value;
  };

  var Cookie = {
    defaults: {
      path: '/'
    },
    set: function (key, value, expires?, path?, domain?, secure?): void {
      if (value === undefined) return;

      var options = {
        expires: expires,
        path: path,
        domain: domain,
        secure: secure
      };

      key = getKey(key);

      options = { ...this.defaults, ...options };

      if (value === null || value === "") {
        options.expires = -1;
      }

      if (typeof options.expires === 'number') {
        var days = options.expires,
          time = options.expires = new Date();
        time.setDate(time.getDate() + days);
      }

      value = typeof value === 'object' ? JSON.stringify(value) : value;

      document.cookie = [
        encodeURIComponent(key), '=', encodeURIComponent(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '',
        options.path ? '; path=' + options.path : '',
        options.domain ? '; domain=' + options.domain : '',
        options.secure ? '; secure' : ''
      ].join('');
    },
    get: function (key): any {
      var
        cookies = document.cookie.split('; '),
        result = key ? null : {},
        parts,
        name,
        cookie;

      key = getKey(key);

      for (var i = 0, l = cookies.length; i < l; i++) {
        parts = cookies[i].split('=');
        name = decode(parts.shift());
        cookie = decode(parts.join('='));

        if (key && key === name) {
          result = cookie;
          break;
        }

        if (!key) {
          result[name] = cookie;
        }
      }

      return result;
    },
    remove: function (key): void {
      key = getKey(key);
      if (this.get(key) !== null) {
        var arg = [].slice.call(arguments, 1);
        arg.unshift(key, null);
        this.set.apply(this, arg);
      }
    },
    clear: function (clearAll?: boolean): void {
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (var i = keys.length; i--;) {
          if (clearAll || decode(keys[i]).split(":")[0] === STORAGE_KEY)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
      }
    },
    length: function (isAll?: boolean): number {
      if (isAll) {
        return document.cookie.length;
      } else {
        var keys: Array<string> = document.cookie.match(/[^ =;]+(?=\=)/g);
        return keys.filter(function (key) {
          return decode(key).split(":")[0] === STORAGE_KEY;
        }).length;
      }
    }
  };

  var LocalStorage = {
    set: function (key: string, value: any): void {

      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }

      if (isLocalStorageSupported) {
        key = getKey(key);
        window.localStorage.setItem(key, encodeURIComponent(value));
      } else {
        Cookie.set(key, value, 3650);
      }
    },
    get: function (key: string): any {
      var val = '';

      if (isLocalStorageSupported) {
        key = getKey(key);
        val = decodeURIComponent(window.localStorage.getItem(key));
      } else {
        val = JSON.stringify(Cookie.get(key));
      }

      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }

    },
    remove: function (key: string): void {
      if (isLocalStorageSupported) {
        key = getKey(key);
        window.localStorage.removeItem(key);
      } else {
        Cookie.remove(key);
      }
    },
    clear: function (clearAll?: boolean): void {
      if (isLocalStorageSupported) {
        if (clearAll) {
          window.localStorage.clear();
        } else {
          Object.keys(window.localStorage).forEach(function (key) {
            if (key.split(":")[0] === STORAGE_KEY) {
              window.localStorage.removeItem(key);
            }
          });
        }
      } else {
        Cookie.clear(clearAll);
      }
    },
    length: function (isAll?: boolean): number {
      if (isAll) {
        return window.localStorage.length;
      } else {
        return Object.keys(window.localStorage).filter(function (key) {
          return key.split(":")[0] === STORAGE_KEY;
        }).length;
      }
    }
  };

  var SessionStorage = {
    set: function (key: string, value: any): void {

      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }

      if (isLocalStorageSupported) {
        key = getKey(key);
        window.sessionStorage.setItem(key, encodeURIComponent(value));
      } else {
        Cookie.set(key, value);
      }
    },
    get: function (key: string): any {
      var val = '';

      if (isLocalStorageSupported) {
        key = getKey(key);
        val = decodeURIComponent(window.sessionStorage.getItem(key));
      } else {
        val = JSON.stringify(Cookie.get(key));
      }

      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    },
    remove: function (key: string): void {
      if (isLocalStorageSupported) {
        key = getKey(key);
        window.sessionStorage.removeItem(key);
      } else {
        Cookie.remove(key);
      }
    },
    clear: function (clearAll?: boolean): void {
      if (isLocalStorageSupported) {
        if (clearAll) {
          window.sessionStorage.clear();
        } else {
          Object.keys(window.sessionStorage).forEach(function (key) {
            if (key.split(":")[0] === STORAGE_KEY)
              window.sessionStorage.removeItem(key);
          });
        }
      } else {
        Cookie.clear(clearAll);
      }
    },
    length: function (isAll?: boolean): number {
      if (isAll) {
        return window.sessionStorage.length;
      } else {
        return Object.keys(window.sessionStorage).filter(function (key) {
          return key.split(":")[0] === STORAGE_KEY;
        }).length;
      }
    }
  };

  return {
    cookie: Cookie,
    local: LocalStorage,
    session: SessionStorage
  }
  
})();