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
var Http = (function () {
    function Http() {
    }
    Http.prototype.request = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new egret.HttpRequest();
            options.headers = __assign({ "Content-Type": "application/x-www-form-urlencoded" }, options.headers);
            options = __assign({ method: 'GET', processData: true, dataType: 'json' }, options);
            var method = options.method.toLocaleLowerCase();
            var queryParams = method === 'get' ? "?" + _this._parseData(options.data, true) : "";
            xhr.responseType = egret.HttpResponseType.TEXT;
            xhr.open(options.url + queryParams, method === 'get' ? egret.HttpMethod.GET : egret.HttpMethod.POST);
            for (var i in options.headers) {
                xhr.setRequestHeader(i, options.headers[i]);
            }
            xhr.send(method === 'get' ? null : _this._parseData(options.data, options.processData));
            xhr.addEventListener(egret.Event.COMPLETE, function (event) {
                var request = event.currentTarget;
                resolve(options.dataType === 'json' ? JSON.parse(request.response) : request.response);
            }, _this);
            xhr.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event) {
                reject(event.currentTarget);
            }, _this);
        });
    };
    Http.prototype._parseData = function (data, processData) {
        if (data === void 0) { data = {}; }
        if (!processData)
            return JSON.stringify(data);
        var params = [];
        for (var i in data) {
            params.push(i + "=" + data[i]);
        }
        return params.join("&");
    };
    Http.get = function (url, data, cfg) {
        return new Http().request(__assign({ url: url, method: 'GET', data: data }, cfg));
    };
    Http.post = function (url, data, cfg) {
        return new Http().request(__assign({ url: url, method: 'POST', data: data }, cfg));
    };
    return Http;
}());
__reflect(Http.prototype, "Http");
