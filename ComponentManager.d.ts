import * as React from 'react';
export interface Config {
    server: boolean;
}
export declare class ComponentManager {
    static INSTANCE: ComponentManager;
    components: {
        [name: string]: typeof React.Component;
    };
    constructor();
    instances: [React.Component<any, any>];
    renderReactComponent(component: string, props: any): string;
    updateComponent(id: string): void;
    addInstance(instance: React.Component<any, any>): void;
    getInstance(path: string): React.Component<any, any>;
    getNestedInstances(path: string): React.Component<any, any>[];
    setComponents(comps: {
        [name: string]: typeof React.Component;
    }): void;
    initReactComponent(item: any): void;
    initReactComponents(): void;
    static init(cfg: Config): void;
    setAllEditableVisible(path: string, visible: boolean): void;
}
