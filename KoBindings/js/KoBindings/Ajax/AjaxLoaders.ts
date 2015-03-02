export function rawAjaxRequest(url: string, callback: (result: string) => void) {
    var HTTPReq = new XMLHttpRequest();
    HTTPReq.onreadystatechange = function () {
        if (HTTPReq.readyState != 4) return;
        if (HTTPReq.status !== 200) {
            console.error("Unknown status code " + HTTPReq.status + " when loading url " + url);
            return;
        }
        callback(HTTPReq.responseText);
    }
    HTTPReq.open("GET", url, true);
    HTTPReq.send();
}

var loadingUrls: { [url: string]: { loaded: boolean; result: string; callbacks: Array<(responseText: string) => void> } } = {};
export function cachedAjaxRequest(urlSource: string, callback: (result: string) => void) {
    if (loadingUrls[urlSource]) {
        var urlData = loadingUrls[urlSource];
        if (urlData.loaded) {
            callback(urlData.result);
        } else {
            urlData.callbacks.push(callback);
        }
        return;
    }

    var urlData = { loaded: false, result: "", callbacks: <Array<(responseText: string) => void>>[callback] };
    loadingUrls[urlSource] = urlData;

    rawAjaxRequest(urlSource, function (responseText) {
        urlData.loaded = true;
        urlData.result = responseText;
        urlData.callbacks.forEach(fn => fn(responseText));
    });
}