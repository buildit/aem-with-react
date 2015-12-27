var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ResourceUtils = (function () {
    function ResourceUtils() {
    }
    ResourceUtils.getChildren = function (resource) {
        var children = {};
        Object.keys(resource).forEach(function (propertyName) {
            var child = resource[propertyName];
            if (child["jcr:primaryType"]) {
                children[propertyName] = child;
            }
        });
        return children;
    };
    return ResourceUtils;
})();
exports.ResourceUtils = ResourceUtils;
var AemComponent = (function (_super) {
    __extends(AemComponent, _super);
    function AemComponent() {
        _super.apply(this, arguments);
    }
    AemComponent.prototype.isWcmEnabled = function () {
        return !this.props.wcmmode || this.props.wcmmode !== "disabled";
    };
    AemComponent.prototype.isWcmEditable = function () {
        return ["disabled", "preview"].indexOf(this.props.wcmmode) < 0;
    };
    return AemComponent;
})(React.Component);
exports.AemComponent = AemComponent;
var ResourceComponent = (function (_super) {
    __extends(ResourceComponent, _super);
    function ResourceComponent() {
        _super.apply(this, arguments);
    }
    ResourceComponent.prototype.getChildren = function () {
        var resource = this.props.resource;
        var children = {};
        Object.keys(resource).forEach(function (propertyName) {
            var child = resource[propertyName];
            if (child["jcr:primaryType"]) {
                children[propertyName] = child;
            }
        });
        return children;
    };
    ResourceComponent.prototype.getResource = function () {
        return this.props.resource;
    };
    ResourceComponent.prototype.getResourceType = function () {
        return this.getResource()["sling:resourceType"];
    };
    ResourceComponent.prototype.createNewChildNodeNames = function (prefix, count) {
        var index = 1;
        var newNodeNames = [];
        var existingNodeNames = Object.keys(this.getChildren());
        for (var idx = 0; idx < count; idx++) {
            var nodeName = null;
            var index = idx;
            while (nodeName === null || existingNodeNames.indexOf(nodeName) >= 0) {
                nodeName = prefix + "_" + (index++);
            }
            ;
            newNodeNames.push(nodeName);
            existingNodeNames.push(nodeName);
        }
        return newNodeNames;
    };
    return ResourceComponent;
})(AemComponent);
exports.ResourceComponent = ResourceComponent;
var Script = (function (_super) {
    __extends(Script, _super);
    function Script() {
        _super.apply(this, arguments);
    }
    Script.prototype.render = function () {
        return React.createElement("script", { dangerouslySetInnerHTML: { __html: this.props.js } });
    };
    return Script;
})(AemComponent);
exports.Script = Script;
var CqEdit = (function (_super) {
    __extends(CqEdit, _super);
    function CqEdit() {
        _super.apply(this, arguments);
    }
    CqEdit.prototype.render = function () {
        if (this.props.wcmmode == "disabled") {
            return null;
        }
        else {
            var dialog = this.props.dialog || this.props.resourceType + "/dialog";
            var json = {
                "path": this.props.path,
                "dialog": dialog,
                "type": this.props.resourceType
            };
            var js = "CQ.WCM.edit(" + JSON.stringify(json) + ");";
            return React.createElement(Script, {"js": js, "wcmmode": this.props.wcmmode});
        }
    };
    return CqEdit;
})(AemComponent);
exports.CqEdit = CqEdit;
var Cq = (function () {
    function Cq() {
    }
    Cq.on = function (event, cb, ctx) {
        if (typeof window !== "undefined" && window.CQ) {
            window.CQ.WCM.getTopWindow().CQ.WCM.on(event, cb, this);
        }
    };
    Cq.register = function (component) {
        var cb = function (wcmmode) {
            component.props.wcmmode = wcmmode;
            component.forceUpdate();
        }.bind(this);
        Cq.on("wcmmodechange", cb, null);
    };
    return Cq;
})();
exports.Cq = Cq;
var EditMarker = (function (_super) {
    __extends(EditMarker, _super);
    function EditMarker() {
        _super.apply(this, arguments);
    }
    EditMarker.prototype.render = function () {
        if (this.props.wcmmode == "edit") {
            return React.createElement("h3", {"className": "placeholder"}, this.props.label);
        }
        else {
            return null;
        }
    };
    return EditMarker;
})(AemComponent);
exports.EditMarker = EditMarker;
//# sourceMappingURL=aem.js.map