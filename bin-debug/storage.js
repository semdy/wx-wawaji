var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var storage = (function () {
    var isLocalStorageSupported = function () {
        var testKey = 'test', storage = localStorage;
        try {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return true;
        }
        catch (e) {
            return false;
        }
    }();
    var STORAGE_KEY = Utils.getQueryString("uname") || localStorage.getItem("wx_uname") || 'zaofans';
    function getKey(key) {
        if (key === undefined || key === null || key === "")
            return key;
        return STORAGE_KEY + ":" + key;
    }
    var decode = function (s) {
        return unRfc2068(decodeURIComponent(s.replace(/\+/g, ' ')));
    };
    var unRfc2068 = function (value) {
        if (value.indexOf('"') === 0) {
            value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        return value;
    };
    var Cookie = {
        defaults: {
            path: '/'
        },
        set: function (key, value, expires, path, domain, secure) {
            if (value === undefined)
                return;
            var options = {
                expires: expires,
                path: path,
                domain: domain,
                secure: secure
            };
            key = getKey(key);
            options = __assign({}, this.defaults, options);
            if (value === null || value === "") {
                options.expires = -1;
            }
            if (typeof options.expires === 'number') {
                var days = options.expires, time = options.expires = new Date();
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
        get: function (key) {
            var cookies = document.cookie.split('; '), result = key ? null : {}, parts, name, cookie;
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
        remove: function (key) {
            key = getKey(key);
            if (this.get(key) !== null) {
                var arg = [].slice.call(arguments, 1);
                arg.unshift(key, null);
                this.set.apply(this, arg);
            }
        },
        clear: function (clearAll) {
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (var i = keys.length; i--;) {
                    if (clearAll || decode(keys[i]).split(":")[0] === STORAGE_KEY)
                        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
                }
            }
        },
        length: function (isAll) {
            if (isAll) {
                return document.cookie.length;
            }
            else {
                var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
                return keys.filter(function (key) {
                    return decode(key).split(":")[0] === STORAGE_KEY;
                }).length;
            }
        }
    };
    var LocalStorage = {
        set: function (key, value) {
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            if (isLocalStorageSupported) {
                key = getKey(key);
                localStorage.setItem(key, encodeURIComponent(value));
            }
            else {
                Cookie.set(key, value, 3650);
            }
        },
        get: function (key) {
            var val = '';
            if (isLocalStorageSupported) {
                key = getKey(key);
                val = decodeURIComponent(localStorage.getItem(key));
            }
            else {
                val = JSON.stringify(Cookie.get(key));
            }
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: function (key) {
            if (isLocalStorageSupported) {
                key = getKey(key);
                localStorage.removeItem(key);
            }
            else {
                Cookie.remove(key);
            }
        },
        clear: function (clearAll) {
            if (isLocalStorageSupported) {
                if (clearAll) {
                    localStorage.clear();
                }
                else {
                    Object.keys(localStorage).forEach(function (key) {
                        if (key.split(":")[0] === STORAGE_KEY) {
                            localStorage.removeItem(key);
                        }
                    });
                }
            }
            else {
                Cookie.clear(clearAll);
            }
        },
        length: function (isAll) {
            if (isAll) {
                return localStorage.length;
            }
            else {
                return Object.keys(localStorage).filter(function (key) {
                    return key.split(":")[0] === STORAGE_KEY;
                }).length;
            }
        }
    };
    var SessionStorage = {
        set: function (key, value) {
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            if (isLocalStorageSupported) {
                key = getKey(key);
                sessionStorage.setItem(key, encodeURIComponent(value));
            }
            else {
                Cookie.set(key, value);
            }
        },
        get: function (key) {
            var val = '';
            if (isLocalStorageSupported) {
                key = getKey(key);
                val = decodeURIComponent(sessionStorage.getItem(key));
            }
            else {
                val = JSON.stringify(Cookie.get(key));
            }
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: function (key) {
            if (isLocalStorageSupported) {
                key = getKey(key);
                sessionStorage.removeItem(key);
            }
            else {
                Cookie.remove(key);
            }
        },
        clear: function (clearAll) {
            if (isLocalStorageSupported) {
                if (clearAll) {
                    sessionStorage.clear();
                }
                else {
                    Object.keys(sessionStorage).forEach(function (key) {
                        if (key.split(":")[0] === STORAGE_KEY)
                            sessionStorage.removeItem(key);
                    });
                }
            }
            else {
                Cookie.clear(clearAll);
            }
        },
        length: function (isAll) {
            if (isAll) {
                return sessionStorage.length;
            }
            else {
                return Object.keys(sessionStorage).filter(function (key) {
                    return key.split(":")[0] === STORAGE_KEY;
                }).length;
            }
        }
    };
    return {
        cookie: Cookie,
        local: LocalStorage,
        session: SessionStorage
    };
})();
