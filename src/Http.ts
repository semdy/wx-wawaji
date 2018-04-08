interface xhrBaseOptions {
    headers?: object
    dataType?: string
    processData?: boolean
}

interface xhrOptions extends xhrBaseOptions {
    url: string
    data: object
    method: string
}

class Http {
    public static request(options: xhrOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            let xhr = new egret.HttpRequest();
            options.headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                ...options.headers
            }
            options = { method: 'GET', processData: true, dataType: 'json', ...options }
            const method: string = options.method.toLocaleLowerCase();
            const queryParams: string = method === 'get' ? `?${this._parseData(options.data, true)}` : ""

            xhr.responseType = egret.HttpResponseType.TEXT;
            xhr.open(options.url + queryParams, method === 'get' ? egret.HttpMethod.GET : egret.HttpMethod.POST);
            for (let i in options.headers) {
                xhr.setRequestHeader(i, options.headers[i]);
            }
            xhr.send(method === 'get' ? null : this._parseData(options.data, options.processData));
            xhr.addEventListener(egret.Event.COMPLETE, function (event: egret.Event) {
                var request = <egret.HttpRequest>event.currentTarget;
                resolve(options.dataType === 'json' ? JSON.parse(request.response) : request.response);
            }, this);
            xhr.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event: egret.IOErrorEvent) {
                reject(event.currentTarget);
            }, this);
        })
    }

    private static _parseData(data: object = {}, processData: boolean): string {
        if (!processData) return JSON.stringify(data);
        let params: Array<string> = [];
        for (let i in data) {
            params.push(`${i}=${data[i]}`);
        }
        return params.join("&");
    }

    public static get(url: string, data?: object, cfg?: xhrBaseOptions): Promise<any> {
        return Http.request({
            url: url,
            method: 'GET',
            data: data,
            ...cfg
        })
    }

    public static post(url: string, data?: object, cfg?: xhrBaseOptions): Promise<any> {
        return Http.request({
            url: url,
            method: 'POST',
            data: data,
            ...cfg
        })
    }
}