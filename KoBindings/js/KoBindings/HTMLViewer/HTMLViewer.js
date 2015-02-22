var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "KoBindings/KOWidget"], function (require, exports, KOWidget) {
    var HTMLViewData = (function () {
        function HTMLViewData(time) {
            this.time = time;
        }
        return HTMLViewData;
    })();
    var HTMLViewer = (function (_super) {
        __extends(HTMLViewer, _super);
        function HTMLViewer(model, element) {
            _super.call(this, model, element, !element.innerHTML && './widgets/HTMLViewer.html');
        }
        return HTMLViewer;
    })(KOWidget);
    return HTMLViewer;
});
