import * as React from 'react';
export declare class ResourceUtils {
    static getChildren(resource: any): any;
}
export interface AemProps {
    wcmmode: string;
    cqHidden?: boolean;
}
export declare class AemComponent<P extends AemProps, S> extends React.Component<P, S> {
    isWcmEnabled(): boolean;
    isWcmEditable(): boolean;
    setAllEditableVisible(path: string, visible: boolean): void;
}
export interface Resource {
    "sling:resourceType": string;
}
export interface ResourceProps<C> extends AemProps {
    resource: C;
    component?: string;
    path: string;
    root: boolean;
}
export declare class ResourceComponent<C extends Resource, P extends ResourceProps<any>, S> extends AemComponent<P, S> {
    componentDidMount(): void;
    getChildren(): any;
    getResource(): C;
    getResourceType(): string;
    createNewChildNodeNames(prefix: String, count: number): string[];
}
export interface ScriptProps extends AemProps {
    js: string;
}
export declare class Script extends AemComponent<ScriptProps, any> {
    render(): React.DOMElement<{
        dangerouslySetInnerHTML: {
            __html: string;
        };
    }>;
}
export interface CqEditProps extends AemProps {
    path: string;
    resourceType: string;
    dialog?: string;
}
export declare type WcmModeListener = (wcmmode: string) => void;
export declare class CqEdit extends AemComponent<CqEditProps, any> {
    render(): JSX.Element;
}
export declare class Cq {
    static on(event: string, cb: WcmModeListener, ctx: any): void;
    static register(component: AemComponent<any, any>): void;
}
export interface EditMarkerProps extends AemProps {
    label?: string;
}
export declare class EditMarker extends AemComponent<EditMarkerProps, any> {
    render(): JSX.Element;
}
