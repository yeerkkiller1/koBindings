define(["require", "exports"], function (require, exports) {
    function when(msCheckDelay, callback, condition) {
        if (condition()) {
            callback();
            return;
        }
        setTimeout(function () {
            when(msCheckDelay, callback, condition);
        }, msCheckDelay);
    }
    return when;
});
