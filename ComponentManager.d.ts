import * as React from 'react';
export interface Config {
    server: boolean;
}
export declare class ComponentManager {
    static INSTANCE: ComponentManager;
    components: {
        [name: string]: typeof React.Component;
    };
    renderReactComponent(component: string, props: any): string;
    updateComponent(id: string): void;
    setComponents(comps: {
        [name: string]: typeof React.Component;
    }): void;
    initReactComponent(item: any): void;
    initReactComponents(): void;
    static init(cfg: Config): void;
}
