import ko = require("knockout");

import AjaxLoaders = require("KoBindings/Ajax/AjaxLoaders");

function loadKOTemplate(urlSource,  callback) {
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

var KOWidgetCurId = 1;
function KOWidgetGetNextId() {
    return "KOWidgetId" + KOWidgetCurId++;
}
var KOWidgetStore: {[id: string]: KOWidget<any>} = {};

class KOWidget<T> {
    private loaded = false;
    //Used for KO Binding
    private bindingDataAccessor;
    private id = KOWidgetGetNextId();

    //True if we load our data from a url template (just !!this.url)
    private templateLoaded: boolean;

    //Ugh... we shouldn't really need this to be accurate, just used if we want to call ko.bindingHandlers.template functions.
    private koBindingData: {
        allBindings: any;
        viewModel: any;
        bindingContext: any;
    };

    constructor(
        public model: T,
        private element: HTMLElement,
        private url?: string
    ) {
        this.koBindingData = { allBindings: [], viewModel: model, bindingContext: new (<any>ko).bindingContext() };

        this.templateLoaded = !!url;
        var templateLoaded = this.templateLoaded;
        if (templateLoaded && element.innerHTML && !element.getAttribute("data-wipeOutHTML")) {
            console.error("You are requesting KOWidget wipe out the innerHTML for element", element, "if you really want us to do this, set the wipeOutHTML attribute to true on the element (data-wipeOutHTML=\"true\").");
        }

        if (!templateLoaded && url) {
            console.warn("When loading widget the HTML was marked as present and there was a url. The url will be ignored for element", element);
        }

        if (!templateLoaded) {
            this.url = this.id;
        }

        this.bindingDataAccessor = () => {
            return {
                name: this.url,
                data: this.model
            };
        };

        KOWidgetStore[this.id] = this;
        element.setAttribute("KOWidgetId", this.id);

        this.init();
    }

    public static getWidgetForElement(element: HTMLElement, nothrow?: boolean) {
        var id = element.getAttribute("KOWidgetId");
        if (id === undefined) {
            if (!nothrow) {
                throw new Error("No widget associated with element id=" + element.id + " class=" + element.className);
            }
            return null;
        }
        return KOWidgetStore[id];
    }

    public init() {
        console.log("Created KOWidget " + this.url);

        if (!this.templateLoaded) {
            this.loaded = true;

            var childNodes = this.element.childNodes;
            for (var ix = 0; ix < childNodes.length; ix++) {
                var childNode = childNodes[ix];

                if (childNode.nodeType === Node.COMMENT_NODE && childNode.textContent.indexOf("/ko") >= 0) {
                    console.warn("Warning, there are parts of a KOWidget which cannot be bound to that look like they use ko comment syntax.", this.element, childNode);
                } else if(childNode.nodeType === Node.ELEMENT_NODE) {
                    ko.applyBindings(this.model, childNode);
                }
            }
        } else {
            loadKOTemplate(this.url,() => {
                this.loaded = true;
                var allBindings = this.koBindingData.allBindings;
                var viewModel = this.koBindingData.viewModel;
                var bindingContext = this.koBindingData.bindingContext;

                ko.bindingHandlers.template.init(this.element, this.bindingDataAccessor, allBindings, viewModel, bindingContext);
                this.update();
            });
        }
    }
    public update() {
        if (!this.loaded) return;

        if (!this.templateLoaded) return;

        if (this.templateLoaded) {
            console.log("Updating KOWidget " + this.url);

            var allBindings = this.koBindingData.allBindings;
            var viewModel = this.koBindingData.viewModel;
            var bindingContext = this.koBindingData.bindingContext;

            ko.bindingHandlers.template.update(this.element, this.bindingDataAccessor, allBindings, viewModel, bindingContext);
        }
    }
}

ko.bindingHandlers['KOWidget'] = {
    init: function (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) {
        var data = valueAccessor();

        var url: string = data.url;
        var model = data.model;

        var templateLoaded = !data.htmlPresent;

        if (!data.type) {
            new KOWidget(model, element, url);
        } else {
            require([data.type], function (WidgetType) {
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

export = KOWidget;