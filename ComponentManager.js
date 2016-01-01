var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var CqUtils_1 = require('./CqUtils');
var RootComponent = (function (_super) {
    __extends(RootComponent, _super);
    function RootComponent() {
        _super.apply(this, arguments);
    }
    RootComponent.prototype.render = function () {
        return React.createElement(this.props.comp, this.props);
    };
    return RootComponent;
})(React.Component);
var Instance = (function () {
    function Instance() {
    }
    Instance.prototype.rerender = function (extraProps) {
        var _this = this;
        var newProps = {};
        Object.keys(this.props).forEach(function (key) {
            newProps[key] = _this.props[key];
        });
        Object.keys(extraProps).forEach(function (key) {
            newProps[key] = extraProps[key];
        });
        React.render(React.createElement(RootComponent, React.__spread({"comp": this.componentClass}, newProps)), this.node);
    };
    Instance.prototype.reload = function () {
        var _this = this;
        var origin = window.location.origin;
        var me = this;
        window.fetch(origin + this.props.path + "." + this.props.depth + ".json", { credentials: 'same-origin' }).then(function (response) {
            return response.json();
        }).then(function (resource) {
            _this.rerenderByResource(resource);
        });
    };
    Instance.prototype.rerenderByResource = function (resource) {
        this.rerender({ resource: resource });
    };
    return Instance;
})();
exports.Instance = Instance;
var ComponentManager = (function () {
    function ComponentManager() {
        this.components = null;
        this.instances = {};
    }
    ComponentManager.prototype.renderReactComponent = function (component, props) {
        var comp = this.components[component];
        console.log("rendering " + component);
        return React.renderToString(React.createElement(RootComponent, React.__spread({"comp": comp}, props)));
    };
    ComponentManager.prototype.updateComponent = function (id) {
        var item = document.querySelectorAll('[data-react-id="' + id + '"]');
        if (item && item.length > 0) {
            this.initReactComponent(item[0]);
        }
    };
    ComponentManager.prototype.addComponent = function (component) {
        var instance = this.instances[component.props.path];
        if (instance) {
            instance.component = component;
        }
    };
    ComponentManager.prototype.addInstance = function (path, componentClass, props, node) {
        var instance = new Instance();
        instance.props = props;
        instance.node = node;
        instance.componentClass = componentClass;
        this.instances[path] = instance;
    };
    ComponentManager.prototype.getInstance = function (path) {
        return this.instances[path];
    };
    ComponentManager.prototype.getNestedInstances = function (path) {
        var _this = this;
        var nested = [];
        Object.keys(this.instances).forEach(function (instancePath) {
            var instance = _this.instances[instancePath];
            if (instancePath && instance.props.root && instancePath.length > path.length && instancePath.substring(0, path.length) == path) {
                nested.push(instance);
            }
        }, this);
        return nested;
    };
    ComponentManager.prototype.setComponents = function (comps) {
        this.components = comps;
    };
    ComponentManager.prototype.initReactComponent = function (item) {
        var textarea = document.getElementById(item.getAttribute('data-react-id'));
        if (textarea) {
            var props = JSON.parse(textarea.value);
            props.root = true;
            var comp = this.components[props.component];
            if (comp == null) {
                console.error("React component '" + props.component + "' does not exist in component list.");
            }
            else {
                console.info("Rendering react component '" + props.component + "'.");
                var component = React.render(React.createElement(RootComponent, React.__spread({"comp": comp}, props)), item);
                this.addInstance(props.path, comp, props, item);
            }
        }
        else {
            console.error("React config with id '" + item.getAttribute('data-react-id') + "' has no corresponding textarea element.");
        }
    };
    ComponentManager.prototype.reloadComponent = function (path) {
        var instance = this.instances[path];
        instance.reload();
    };
    ComponentManager.prototype.getParentInstance = function (path) {
        var parts = path.split("/");
        var parent = this.instances[path];
        while (parts.length > 0 && parent == null) {
            parts.pop();
            path = parts.join("/");
            parent = this.instances[path];
            ;
        }
        return parent;
    };
    ComponentManager.prototype.reloadRoot = function (path) {
        this.getParentInstance(path).reload();
    };
    ComponentManager.prototype.reloadRootInCq = function (path) {
        var parent = this.getParentInstance(path);
        var parentPath = parent.props.path;
        setTimeout(function () {
            CqUtils_1.default.removeEditable(path);
        }, 0);
        CqUtils_1.default.refresh(parentPath);
    };
    ComponentManager.prototype.initReactComponents = function () {
        var items = [].slice.call(document.querySelectorAll('[data-react]'));
        console.log(items.length + " react configs found.");
        for (var _i = 0; _i < items.length; _i++) {
            var item = items[_i];
            this.initReactComponent(item);
        }
    };
    ComponentManager.init = function (cfg) {
        ComponentManager.INSTANCE = new ComponentManager();
        if (cfg.server) {
            if (typeof AemGlobal === "undefined") {
                throw "this is not the server side AEM context";
            }
            AemGlobal.renderReactComponent = ComponentManager.INSTANCE.renderReactComponent.bind(ComponentManager.INSTANCE);
        }
        else {
            if (typeof AemGlobal == "undefined") {
                AemGlobal = {};
            }
            if (typeof window === "undefined") {
                throw "this is not the browser";
            }
            window.initReactComponents = ComponentManager.INSTANCE.initReactComponents.bind(ComponentManager.INSTANCE);
            AemGlobal.componentManager = ComponentManager.INSTANCE;
            AemGlobal.CqUtils = CqUtils_1.default;
        }
    };
    ComponentManager.prototype.setAllEditableVisible = function (path, visible) {
        if (typeof window !== "undefined") {
            setTimeout(function () {
                this.getNestedInstances(path).forEach(function (instance) {
                    instance.rerender({ cqHidden: !visible });
                });
            }.bind(this), 0);
        }
    };
    return ComponentManager;
})();
exports.ComponentManager = ComponentManager;
//# sourceMappingURL=ComponentManager.js.map