//Comment test fuck

function watchProperty(obj, propName, callback) {
    var _privateValue = obj[propName];

    Object.defineProperty(obj, propName, {
        get: function () {
            return _privateValue;
        },
        set: function (val) {
            _privateValue = val;
            callback(obj[propName]);
        }
    });
}

function debugProperty(obj, propName) {
    var _prevValue = obj[propName];
    watchProperty(obj, propName, function (newValue) {
        logCallstack(propName + " change:\t" + JSON.stringify(_prevValue) + " --> " + JSON.stringify(newValue));
        _prevValue = newValue;
    });
}

function debugNArrayElements(array, N, NStart, arrayName) {
    NStart = NStart || 0;
    arrayName = arrayName || "array";
    for (var ix = NStart; ix < NStart + N; ix++) {
        (function watchElement(ix) {
            var _prevValue = array[ix];
            watchProperty(array, ix, function (newValue) {
                logCallstack(arrayName + "[" + ix + "] changed:\t" + JSON.stringify(_prevValue) + " --> " + JSON.stringify(newValue));
                _prevValue = newValue;
            });
        })(ix);
    }
}