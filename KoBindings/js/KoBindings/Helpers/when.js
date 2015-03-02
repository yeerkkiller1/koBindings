define(["require", "exports"], function (require, exports) {
    function when(msCheckDelay, maxDelay, callback, condition) {
        var val = condition();
        if (val) {
            callback(val);
            return;
        }
        else if (maxDelay <= 0) {
            throw new Error("Condition did not complete in the required time" + condition);
        }
        setTimeout(function () {
            when(msCheckDelay, maxDelay - msCheckDelay, callback, condition);
        }, msCheckDelay);
    }
    return when;
});
