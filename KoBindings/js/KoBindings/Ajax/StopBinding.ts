import ko = require("knockout");

ko.bindingHandlers["StopBinding"] = {
    init: function () {
        return { 'controlsDescendantBindings': true };
    }
};