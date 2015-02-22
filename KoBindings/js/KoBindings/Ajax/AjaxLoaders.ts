export function rawAjaxRequest(url, callback) {
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

var loadingUrls: { [url: string]: { loaded: boolean; callbacks: Array<(responseText: string) => void> } } = {};
export function cachedAjaxRequest(urlSource, callback) {
    if (loadingUrls[urlSource]) {
        var urlData = loadingUrls[urlSource];
        if (urlData.loaded) {
            callback();
        } else {
            urlData.callbacks.push(callback);
        }
        return;
    }

    var urlData = { loaded: false, callbacks: <Array<(responseText: string) => void>>[callback] };
    loadingUrls[urlSource] = urlData;

    var name = urlSource;
    if (document.getElementById(name)) {
        callback();
        return;
    }
    //Huh... if we set type="text/html" it is not actually loading it? w/e... XMLHttpRequest works fine

    rawAjaxRequest(urlSource, function (responseText) {
        urlData.loaded = true;
        urlData.callbacks.forEach(fn => fn(responseText));
    });
}