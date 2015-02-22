///<amd-dependency path="KoBindings/Ajax/StopBinding"/>

import HTMLViewer = require("KoBindings/HTMLViewer/HTMLViewer");
import ko = require("knockout");

window["ko"] = ko;

var testModel = {
    time: ko.observable(0)
};

new HTMLViewer(testModel, document.getElementById("jsLoaded"));
new HTMLViewer(testModel, document.getElementById("jsLoaded2"));

setInterval(function () {
    testModel.time(testModel.time() + 1);
}, 1000);

ko.applyBindings(testModel);