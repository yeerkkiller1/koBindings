import KOWidget = require("KoBindings/KOWidget");

class HTMLViewData {
    constructor(
        public time: KnockoutObservable<number>
    ) { }
}

class HTMLViewer extends KOWidget<HTMLViewData> {
    constructor(
        model: HTMLViewData,
        element: HTMLElement
    ) {
        super(model, element, !element.innerHTML && './widgets/HTMLViewer.html');
    }
}

export = HTMLViewer;