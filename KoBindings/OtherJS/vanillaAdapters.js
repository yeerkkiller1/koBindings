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