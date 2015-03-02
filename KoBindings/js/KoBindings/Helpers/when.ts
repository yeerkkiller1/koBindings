function when(msCheckDelay: number, callback: () => void, condition: () => boolean) {
    if (condition()) {
        callback();
        return;
    }
    setTimeout(function () {
        when(msCheckDelay, callback, condition);
    }, msCheckDelay);
}

export = when;