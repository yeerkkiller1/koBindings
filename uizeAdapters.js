//Similar to forceObservable, but if the property is already a proper
//  Uize property it already has an onChange handler, so we can just attach to that.
//Adds an observable (which is an observable but not exposed as a Uize property, just a raw javascript
//  property) called propName + "Observ".
//If filter is provided and returns true for a given value,
//  that value is NOT passed from the Uize object to the observable.
function addObservToUize(obj, propName, filter) {
    var observName = propName + "Observ";
    if(obj[observName]) return;

    var observ = ko.observable(obj.get(propName));
    obj.wire('Changed.' + propName, function(delta){
        var newValue = delta.newValue;
        if(filter && filter(newValue)) return;
        observ(newValue);
    });
    observ.subscribe(function(newValue){
        obj.set(propName, newValue);
    });
    obj[observName] = observ;
}