import * as React from "react";
import CqUtils from "./CqUtils";
import * as aem from "./aem";


declare var AemGlobal: any;

export interface Config {
    server: boolean;
}

type RootComponentProps = {
    comp: typeof React.Component;
    component: string;
}

class RootComponent extends React.Component<RootComponentProps, any> {
    public render(): React.ReactElement<any> {
        return React.createElement(this.props.comp, this.props);
    }
}


export class Instance {
    public path: string;
    public component: aem.AemComponent<any, any>;
    public node: any;
    public props: any;
    public componentClass: any;

    public rerender(extraProps: any): void {
        let newProps: any = {};
        Object.keys(this.props).forEach((key: string) => {
            newProps[key] = this.props[key];
        });
        Object.keys(extraProps).forEach((key: string) => {
            newProps[key] = extraProps[key];
        });
        React.render(<RootComponent comp={this.componentClass} {...newProps} />, this.node);
    }

    public reload(): void {
        let origin: string = window.location.origin;
        // TODO props.depth should be replaced by special suffix so loading of json can be customized in java class.
        let url: string = origin + this.props.path + "." + this.props.depth + ".json";
        (window as FetchWindow).fetch(url, {credentials: "same-origin"}).then((response: any) => {
            return response.json();
        }).then((resource: any) => {
            this.rerenderByResource(resource);
        });

    }

    public rerenderByResource(resource: aem.Resource): void {
        this.rerender({resource: resource});
    }
}

// TODO: find proper typing and add polyfill
interface FetchWindow extends Window {
    fetch(url: string, options: any): any;
}


export class ComponentManager {
    public static INSTANCE: ComponentManager;
    public components: { [name: string]: typeof React.Component } = null;
    private instances: {[path: string]: Instance};

    /**
     * initialize the react components.
     * @param cfg
     */
    public static init(cfg: Config): void {
        ComponentManager.INSTANCE = new ComponentManager();
        if (cfg.server) {
            if (typeof AemGlobal === "undefined") {
                throw "this is not the server side AEM context";
            }
            AemGlobal.renderReactComponent = ComponentManager.INSTANCE.renderReactComponent.bind(ComponentManager.INSTANCE);
        } else {
            if (typeof AemGlobal === "undefined") {
                AemGlobal = {};
            }
            if (typeof window === "undefined") {
                throw "this is not the browser";
            }
            window.initReactComponents = ComponentManager.INSTANCE.initReactComponents.bind(ComponentManager.INSTANCE);
            AemGlobal.componentManager = ComponentManager.INSTANCE;
            AemGlobal.CqUtils = CqUtils;
        }
    }

    constructor() {
        this.instances = {} as {[path: string]:  Instance};
    }


    public renderReactComponent(component: string, props: any): string {
        let comp: typeof React.Component = this.components[component];
        console.log("rendering " + component);
        return React.renderToString(<RootComponent comp={comp} {...props} />);
    }

    public updateComponent(id: string): void {
        let item: any = document.querySelectorAll("[data-react-id='" + id + "']");
        if (item && item.length > 0) {
            this.initReactComponent(item[0]);
        }
    }

    public addComponent(component: React.Component<any, any>): void {
        let instance: Instance = this.instances[component.props.path];
        if (instance) {
            instance.component = component as aem.AemComponent<any, any>;
        }
    }

    public addInstance(path: string, componentClass: any, props: any, node: any): void {
        let instance: Instance = new Instance();
        instance.props = props;
        instance.node = node;
        instance.componentClass = componentClass;
        this.instances[path] = instance;
    }

    public getInstance(path: string): Instance {
        return this.instances[path];
    }

    public getNestedInstances(path: string): [Instance] {
        let nested: [Instance] = [] as [Instance];
        Object.keys(this.instances).forEach((instancePath: string) => {
            let instance: Instance = this.instances[instancePath];
            let subPath: boolean = instancePath && instancePath.length > path.length && instancePath.substring(0, path.length) === path;
            if (instance.props.root && subPath) {
                nested.push(instance);
            }
        }, this);
        return nested;
    }

    /**
     * set the components
     * @param comps
     */
    public setComponents(comps: { [name: string]: typeof React.Component }): void {
        this.components = comps;
    }

    public initReactComponent(item: any): void {
        let textarea = document.getElementById(item.getAttribute("data-react-id")) as HTMLTextAreaElement;
        if (textarea) {
            let props = JSON.parse(textarea.value);
            props.root = true;
            let comp = this.components[props.component];
            if (comp == null) {
                console.error("React component '" + props.component + "' does not exist in component list.");
            } else {
                console.log("Rendering react component '" + props.component + "'.");
                React.render(<RootComponent comp={comp} {...props} />, item);
                this.addInstance(props.path, comp, props, item);

            }
        } else {
            console.error("React config with id '" + item.getAttribute("data-react-id") + "' has no corresponding textarea element.");
        }
    }

    public reloadComponent(path: string): void {
        let instance: Instance = this.instances[path];
        instance.reload();
    }

    public getParentInstance(path: string): Instance {
        let parts: string[] = path.split("/");
        let parent: Instance = this.instances[path];
        while (parts.length > 0 && parent == null) {
            parts.pop();
            path = parts.join("/");
            parent = this.instances[path];
        }
        return parent;
    }

    public reloadRoot(path: string): void {
        this.getParentInstance(path).reload();
    }

    public reloadRootInCq(path: string): void {
        let parent: Instance = this.getParentInstance(path);
        let parentPath: string = parent.props.path;
        setTimeout(() => {
            CqUtils.removeEditable(path);
        }, 0);
        CqUtils.refresh(parentPath);
    }


    public initReactComponents(): void {
        let items = [].slice.call(document.querySelectorAll("[data-react]"));
        console.log(items.length + " react configs found.");
        for (let item of items) {
            this.initReactComponent(item);
        }
    }

    public setAllEditableVisible(path: string, visible: boolean): void {
        if (typeof window !== "undefined") {
            setTimeout(function (): void {
                this.getNestedInstances(path).forEach((instance: Instance) => {
                    instance.rerender({cqHidden: !visible});
                });
            }.bind(this), 0);
        }
    }
}

