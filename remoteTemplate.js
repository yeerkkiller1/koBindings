ko.bindingHandlers.remoteTemplate = {
    init: function(element, valueAccessor) {
        var self = this;
        var args = arguments;

        var obj = valueAccessor();
        var url = obj.url;

        function applyBindings() {
            try {
                ko.bindingHandlers.template.init.apply(self, args);
                ko.bindingHandlers.template.update.apply(self, args);
            } catch(err){console.error(err);}
        }

        //TODO: just use a normal script tag and use onload?
        var HTTPReq = new XMLHttpRequest();

        HTTPReq.onreadystatechange = function() {
            if (HTTPReq.readyState != 4) return;
            if(HTTPReq.status !== 200) {
                console.error("Unknown status code " + HTTPReq.status + " when loading url " + url);
                return;
            }

            var binding = document.createElement("script");
            binding.type = "text/html";
            binding.id = obj.name;
            binding.text = HTTPReq.responseText;

            element.ownerDocument.body.appendChild(binding);
            if(obj.css) {
                var cssPath = obj.css;
                if(typeof cssPath === "boolean") {
                    cssPath = url.replace(".html", ".css");
                }
                var css = document.createElement("link");
                css.rel = "stylesheet";
                css.href = cssPath;

                element.ownerDocument.body.appendChild(css);
            }

            applyBindings();
        }

        if(element.ownerDocument.querySelector("script[id='"+obj.name+"']")) {
            applyBindings();
        } else {
            HTTPReq.open("GET", url, true);
            HTTPReq.send();
        }
    }, update: function(element, valueAccessor) {
        var obj = valueAccessor();
        if(!document.getElementById(obj.name)) return;
        try {
            ko.bindingHandlers.template.update.apply(this, arguments);
        } catch(err){console.error(err);}
    }
}