define(["require", "exports"], function (require, exports) {
    function when(msCheckDelay, callback, condition) {
        var val = condition();
        if (val) {
            callback(val);
            return;
        }
        setTimeout(function () {
            when(msCheckDelay, callback, condition);
        }, msCheckDelay);
    }
    return when;
});
