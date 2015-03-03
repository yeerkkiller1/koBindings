/// <reference path="../../libs/knockout.d.ts"/>
/// <reference path="../../libs/require.d.ts"/>
define(["require", "exports", "knockout", "KoBindings/Ajax/AjaxLoaders"], function (require, exports, ko, AjaxLoaders) {
    function loadKOTemplate(urlSource, callback) {
        if (document.querySelector("script[id='" + urlSource + "']")) {
            callback();
            return;
        }
        AjaxLoaders.cachedAjaxRequest(urlSource, function (responseText) {
            var script = document.createElement("script");
            script.id = urlSource;
            script.type = "text/html";
            script.text = responseText;
            document.head.appendChild(script);
            callback();
        });
    }
    function loadCSS(urlSource, callback) {
        if (document.querySelector("link[href='" + urlSource + "']")) {
            if (callback)
                callback();
            return;
        }
        AjaxLoaders.cachedAjaxRequest(urlSource, function (responseText) {
            var css = document.createElement("link");
            css.href = urlSource;
            css.rel = "stylesheet";
            css.type = "text/css";
            document.head.appendChild(css);
            if (callback)
                callback();
        });
    }
    var KOWidgetCurId = 1;
    function KOWidgetGetNextId() {
        return "KOWidgetId" + KOWidgetCurId++;
    }
    var KOWidgetStore = {};
    var KOWidget = (function () {
        function KOWidget(model, element, url, cssUrl) {
            var _this = this;
            this.model = model;
            this.element = element;
            this.url = url;
            this.cssUrl = cssUrl;
            this.loaded = false;
            this.id = KOWidgetGetNextId();
            for (var key in KOWidget.prototype)
                this[key] = this[key].bind(this);
            var bindingContext = ko.contextFor(element);
            this.koBindingData = { allBindings: [], viewModel: model, bindingContext: bindingContext || new ko.bindingContext() };
            this.templateLoaded = !!url;
            var templateLoaded = this.templateLoaded;
            if (templateLoaded && element.innerHTML && !element.getAttribute("data-wipeOutHTML")) {
                console.error("You are requesting KOWidget wipe out the innerHTML for element", element, "if you really want us to do this, set the wipeOutHTML attribute to true on the element (data-wipeOutHTML=\"true\").");
            }
            if (!templateLoaded && url) {
                console.warn("When loading widget the HTML was marked as present and there was a url. The url will be ignored for element", element);
            }
            if (!url && cssUrl) {
                throw new Error("You cannot load the css dynamically without loading the html dynamically (if you pass cssUrl, you MUST also pass a URL)");
            }
            if (!templateLoaded) {
                //Just for debugging, not the url is not related to id.
                this.url = this.id;
            }
            this.bindingDataAccessor = function () {
                return {
                    name: _this.url,
                    data: _this.model
                };
            };
            KOWidgetStore[this.id] = this;
            element.setAttribute("KOWidgetId", this.id);
            this.beforeBind();
            this.init();
        }
        KOWidget.getWidgetForElement = function (element, nothrow) {
            var id = element.getAttribute("KOWidgetId");
            if (id === undefined) {
                if (!nothrow) {
                    throw new Error("No widget associated with element id=" + element.id + " class=" + element.className);
                }
                return null;
            }
            return KOWidgetStore[id];
        };
        KOWidget.prototype.init = function () {
            var _this = this;
            console.log("Created KOWidget " + this.url);
            if (this.model.subscribe) {
                this.model.subscribe(this.update);
            }
            if (!this.templateLoaded) {
                this.loaded = true;
                var childNodes = this.element.childNodes;
                for (var ix = 0; ix < childNodes.length; ix++) {
                    var childNode = childNodes[ix];
                    if (childNode.nodeType === Node.COMMENT_NODE && childNode.textContent.indexOf("/ko") >= 0) {
                        console.warn("Warning, there are parts of a KOWidget which cannot be bound to that look like they use ko comment syntax.", this.element, childNode);
                    }
                    else if (childNode.nodeType === Node.ELEMENT_NODE) {
                        ko.applyBindings(this.model, childNode);
                    }
                }
                this.afterBind();
            }
            else {
                if (this.cssUrl) {
                    loadCSS(this.cssUrl);
                }
                loadKOTemplate(this.url, function () {
                    _this.loaded = true;
                    var allBindings = _this.koBindingData.allBindings;
                    var viewModel = _this.koBindingData.viewModel;
                    var bindingContext = _this.koBindingData.bindingContext;
                    ko.bindingHandlers.template.init(_this.element, _this.bindingDataAccessor, allBindings, viewModel, bindingContext);
                    _this.update();
                    _this.afterBind();
                });
            }
        };
        KOWidget.prototype.update = function () {
            if (!this.loaded)
                return;
            if (!this.templateLoaded)
                return;
            if (this.templateLoaded) {
                console.log("Updating KOWidget " + this.url);
                var allBindings = this.koBindingData.allBindings;
                var viewModel = this.koBindingData.viewModel;
                var bindingContext = this.koBindingData.bindingContext;
                ko.bindingHandlers.template.update(this.element, this.bindingDataAccessor, allBindings, viewModel, bindingContext);
            }
        };
        KOWidget.prototype.beforeBind = function () {
        };
        KOWidget.prototype.afterBind = function () {
        };
        return KOWidget;
    })();
    ko.bindingHandlers['KOWidget'] = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var data = valueAccessor();
            var url = data.url;
            var model = data.model;
            var templateLoaded = !data.htmlPresent;
            if (!data.type) {
                new KOWidget(model, element, url);
            }
            else {
                require([data.type], function (WidgetType) {
                    if (data.class) {
                        WidgetType = WidgetType[data.class];
                    }
                    new WidgetType(model, element, url);
                });
            }
            return { 'controlsDescendantBindings': true };
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var widget = KOWidget.getWidgetForElement(element);
            if (widget) {
                widget.update();
            }
        }
    };
    return KOWidget;
});
