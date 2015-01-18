function toggle(observ, values) {
  var index = values.indexOf(observ());
  index = (index + 1) % values.length;
  observ(values[index]);
}

//{observ: observ, values: []}
ko.bindingHandlers.clickToggle = {
  init: function(element, valueAccessor) {
    element.onclick = function() {
      var obj = valueAccessor();
      toggle(obj.observ, obj.values);
    }
  }
};
ko.bindingHandlers.hoverBind = {
  init: function(element, valueAccessor) {
    var observ = valueAccessor();
    element.onmouseover = function() {
      observ(true);
    }
    element.onmouseout = function() {
      observ(false);
    }
  }
};
ko.bindingHandlers.visibleWithClass = {
  init: function(element, valueAccessor) {
    ko.computed(function() {
      var visible = ko.utils.unwrapObservable(valueAccessor());
      if(visible) {
        element.style.display = "block";
        element.classList.add("visible");
      } else {
        element.style.display = "none";
        element.classList.remove("visible");
      }
    });
  }
};

ko.extenders.numeric = function(target, precision) {
    //create a writable computed observable to intercept writes to our observable
    var result = ko.pureComputed({
        read: target,  //always return the original observables value
        write: function(newValue) {
            var current = target(),
                roundingMultiplier = Math.pow(10, precision),
                newValueAsNum = isNaN(newValue) ? 0 : parseFloat(+newValue),
                valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
 
            //only write if it changed
            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    }).extend({ notify: 'always' });
 
    //initialize with current value to make sure it is rounded appropriately
    result(target());
 
    //return the new computed observable
    return result;
};

//Takes {observ, key}.
//Persists the observ, and shares the backing storage with everything that has the same key,
//  so if an observable with the same key changes, our obserable also changes (and the persisted value changes).
ko.bindingHandlers.persistObserv = {
    init: function(_, valueAccessor) {
        var obj = valueAccessor();
        var observ = obj.observ;
        var key = obj.key;

        persistObserv(observ, key);
    }
}
ko.extenders.persist = function(target, option) {
    persistObserv(target, option);
};

function persistObserv(observ, key) {
    //TODO: Make sure we don't persist and observable multiple times, as that could
    //  cause massive performance issues.

    var globalObservs = window.globalObservs = window.globalObservs || {};
    
    //Sync with the globalObservs
    var globalObserv;
    if(globalObservs[key] === undefined) {
        globalObserv = globalObservs[key] = ko.observable(observ());
    } else {
        globalObserv = globalObservs[key];
        observ(globalObserv());
    }
    
    globalObserv.subscribe(observ);
    observ.subscribe(globalObserv);
    
    //And now sync with global storage
    
    if(localStorage[key] !== undefined && localStorage[key] !== "undefined") {
        try {
            globalObserv(JSON.parse(localStorage[key]));
        } catch(err) {
            console.error("Error when loading persist observ from key " + key + ":\n" + err);
        }
    }
    
    ko.computed(function(){
        var value = observ();
        localStorage.setItem(key, JSON.stringify(value));
    });
}