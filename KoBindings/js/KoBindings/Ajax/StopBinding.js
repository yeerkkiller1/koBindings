define(["require", "exports", "knockout"], function (require, exports, ko) {
    ko.bindingHandlers["StopBinding"] = {
        init: function () {
            return { 'controlsDescendantBindings': true };
        }
    };
});
