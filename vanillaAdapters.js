//Observable name becomes propName + "Observ",
//   get/setters are setup so using the old
//   values doesn't cause problems.
function forceObservable(obj, propName) {
    var observName = propName + "Observ";
    if(obj[observName]) return;

    var observ = ko.observable(obj[propName]);
    observ.subscribe(function(newValue){
        obj[propName] = newValue;
    });
    watchProperty(obj, propName, observ);
    obj[observName] = observ;
}

function watchProperty(obj, propName, callback) {
    var _privateValue = obj[propName];

    Object.defineProperty(obj, propName, {
        get: function(){
            return _privateValue;
        },
        set: function(val){
            _privateValue = val;
            callback(obj[propName]);
        }
    });
}