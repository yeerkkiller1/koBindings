define(["require", "exports"], function (require, exports) {
    function rawAjaxRequest(url, callback) {
        var HTTPReq = new XMLHttpRequest();
        HTTPReq.onreadystatechange = function () {
            if (HTTPReq.readyState != 4)
                return;
            if (HTTPReq.status !== 200) {
                console.error("Unknown status code " + HTTPReq.status + " when loading url " + url);
                return;
            }
            callback(HTTPReq.responseText);
        };
        HTTPReq.open("GET", url, true);
        HTTPReq.send();
    }
    exports.rawAjaxRequest = rawAjaxRequest;
    var loadingUrls = {};
    function cachedAjaxRequest(urlSource, callback) {
        if (loadingUrls[urlSource]) {
            var urlData = loadingUrls[urlSource];
            if (urlData.loaded) {
                callback(urlData.result);
            }
            else {
                urlData.callbacks.push(callback);
            }
            return;
        }
        var urlData = { loaded: false, result: "", callbacks: [callback] };
        loadingUrls[urlSource] = urlData;
        rawAjaxRequest(urlSource, function (responseText) {
            urlData.loaded = true;
            urlData.result = responseText;
            urlData.callbacks.forEach(function (fn) { return fn(responseText); });
        });
    }
    exports.cachedAjaxRequest = cachedAjaxRequest;
});
