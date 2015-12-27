var CqUtils = (function () {
    function CqUtils() {
    }
    CqUtils.setVisible = function (path, visible, recursive) {
        if (recursive === void 0) { recursive = true; }
        if (typeof CQ !== "undefined") {
            var editable = CQ.WCM.getEditable(path);
            if (editable) {
                var descendents = CQ.WCM.getNestedEditables(path);
                for (var idx = 0; idx < descendents.length; idx++) {
                    var b = CQ.WCM.getEditable(descendents[idx]);
                    if (b) {
                        var alwaysHidden = b.element.dom.parentNode.getAttribute("data-always-hidden") == "true";
                        if (!alwaysHidden) {
                            this.setVisible(descendents[idx], visible, false);
                        }
                    }
                }
                if (visible) {
                    editable.show(true);
                }
                else {
                    editable.hide(true);
                }
            }
            else {
                var cb = function () {
                    CqUtils.setVisible(path, visible, recursive);
                };
                CQ.WCM.on("editablesready", cb, this);
                CQ.WCM.getTopWindow().CQ.WCM.on("editablesready", cb, this);
                setTimeout(cb, 0);
            }
        }
    };
    CqUtils.addChild = function (ctx, relPath, resourceType) {
        var e = CQ.WCM.getEditable(ctx.path + relPath + "/*");
        e.createParagraph({
            resourceType: resourceType
        });
    };
    return CqUtils;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CqUtils;
//# sourceMappingURL=CqUtils.js.map