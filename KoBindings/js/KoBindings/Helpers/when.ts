function when<T>(msCheckDelay: number, maxDelay: number, callback: (data?: T) => void, condition: () => T) {
    var val = condition()
    if (val) {
        callback(val);
        return;
    } else if (maxDelay <= 0) {
        throw new Error("Condition did not complete in the required time" + condition);
    }
    setTimeout(function () {
        when(msCheckDelay, maxDelay - msCheckDelay, callback, condition);
    }, msCheckDelay);
}

export = when;