var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Aem = require('./aem');
var StackContainer = (function (_super) {
    __extends(StackContainer, _super);
    function StackContainer(props) {
        _super.call(this, props);
        this.state = { activeIndex: 0 };
        Aem.Cq.register(this);
    }
    StackContainer.prototype.getContentModel = function (content) {
        var contentModel = [];
        var children = Aem.ResourceUtils.getChildren(content);
        Object.keys(children).forEach(function (key, idx) {
            var child = children[key];
            var label = child.label || "set label please";
            var resourceType = child["sling:resourceType"];
            contentModel.push({ node: key, label: label, resourceType: resourceType });
        }, this);
        return contentModel;
    };
    ;
    return StackContainer;
})(Aem.ResourceComponent);
exports.StackContainer = StackContainer;
//# sourceMappingURL=container.js.map