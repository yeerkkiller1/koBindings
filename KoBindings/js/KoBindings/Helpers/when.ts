function when<T>(msCheckDelay: number, callback: (data?: T) => void, condition: () => T) {
    var val = condition()
    if (val) {
        callback(val);
        return;
    }
    setTimeout(function () {
        when(msCheckDelay, callback, condition);
    }, msCheckDelay);
}

export = when;