var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aem = require('./aem');
var React = require('react');
var CqUtils_1 = require('./CqUtils');
var ResourceInclude = (function (_super) {
    __extends(ResourceInclude, _super);
    function ResourceInclude() {
        _super.apply(this, arguments);
    }
    ResourceInclude.prototype.componentDidMount = function () {
        if (this.props.hidden) {
            CqUtils_1.default.setVisible(this.props.path, false);
        }
    };
    ResourceInclude.prototype.render = function () {
        var innerHTML = "{{{include-resource \"" + this.props.path + "\" \"" + this.props.resourceType + "\"}}}";
        if (!!this.props.hidden) {
        }
        if (this.props.hidden) {
            CqUtils_1.default.setVisible(this.props.path, false, false);
        }
        return React.createElement(this.props.element || "div", {
            "data-always-hidden": this.props.hidden,
            hidden: !!this.props.hidden,
            dangerouslySetInnerHTML: { __html: innerHTML }
        });
    };
    return ResourceInclude;
})(aem.AemComponent);
exports.ResourceInclude = ResourceInclude;
//# sourceMappingURL=include.js.map