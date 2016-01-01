import * as React from 'react';
import * as aem from './aem';
export interface Config {
    server: boolean;
}
export declare class Instance {
    path: string;
    component: aem.AemComponent<any, any>;
    node: any;
    props: any;
    componentClass: any;
    rerender(extraProps: any): void;
    reload(): void;
    rerenderByResource(resource: aem.Resource): void;
}
export declare class ComponentManager {
    static INSTANCE: ComponentManager;
    components: {
        [name: string]: typeof React.Component;
    };
    constructor();
    instances: {
        [path: string]: Instance;
    };
    renderReactComponent(component: string, props: any): string;
    updateComponent(id: string): void;
    addComponent(component: React.Component<any, any>): void;
    addInstance(path: string, componentClass: any, props: any, node: any): void;
    getInstance(path: string): Instance;
    getNestedInstances(path: string): [Instance];
    setComponents(comps: {
        [name: string]: typeof React.Component;
    }): void;
    initReactComponent(item: any): void;
    reloadComponent(path: string): void;
    getParentInstance(path: string): Instance;
    reloadRoot(path: string): void;
    reloadRootInCq(path: string): void;
    initReactComponents(): void;
    static init(cfg: Config): void;
    setAllEditableVisible(path: string, visible: boolean): void;
}
