import * as React from 'react';


declare var AemGlobal:any;

export interface Config {
    server: boolean;
}

type RootComponentProps = {
    comp: typeof React.Component;
    component: string;
}

class RootComponent extends React.Component<RootComponentProps, any> {
    render() {
        return React.createElement(this.props.comp, this.props);
    }
}


export class ComponentManager {
    static INSTANCE:ComponentManager;
    public components:{ [name: string]: typeof React.Component } = null;

    renderReactComponent(component:string, props:any):string {
        let comp = this.components[component];
        console.log("rendering " + component);
        return React.renderToString(<RootComponent comp={comp} {...props} />);
    }

    updateComponent(id:string) {
        let item:any = document.querySelectorAll('[data-react-id="' + id + '"]');
        if (item && item.length>=0) {
            this.initReactComponent(item[0]);
        }
    }

    /**
     * set the components
     * @param comps
     */
    setComponents(comps:{ [name: string]: typeof React.Component }):void {
        this.components = comps;
    }

    initReactComponent(item:any) {
        let textarea = document.getElementById(item.getAttribute('data-react-id')) as HTMLTextAreaElement;
        if (textarea) {
            let props = JSON.parse(textarea.value);
            let comp = this.components[props.component];
            if (comp == null) {
                console.error("React component '" + props.component + "' does not exist in component list.");
            } else {
                console.info("Rendering react component '" + props.component + "'.");
                let component = React.render(<RootComponent comp={comp} {...props} />, item);

            }
        } else {
            console.error("React config with id '" + item.getAttribute('data-react-id') + "' has no corresponding textarea element.");
        }
    }

    initReactComponents():void {
        let items = [].slice.call(document.querySelectorAll('[data-react]'));
        console.log(items.length + " react configs found.");
        for (let item of items) {
            this.initReactComponent(item);
        }
    }

    /**
     * initialize the react components.
     * @param cfg
     */
    static init(cfg:Config):void {
        ComponentManager.INSTANCE = new ComponentManager();
        if (cfg.server) {
            if (typeof AemGlobal === "undefined") {
                throw "this is not the server side AEM context";
            }
            AemGlobal.renderReactComponent = ComponentManager.INSTANCE.renderReactComponent.bind(ComponentManager.INSTANCE);
        } else {
            if (typeof AemGlobal =="undefined") {
                AemGlobal = {};
            }
            if (typeof window === "undefined") {
                throw "this is not the browser";
            }
            window.initReactComponents = ComponentManager.INSTANCE.initReactComponents.bind(ComponentManager.INSTANCE);
            AemGlobal.componentManager = ComponentManager.INSTANCE;
        }
    }
}

