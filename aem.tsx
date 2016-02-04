import * as React from "react";
import * as component from "./ComponentManager";


interface CqWindow extends Window {
    CQ: any;
}

declare var window: CqWindow;

export class ResourceUtils {

    /**
     * returns only the properties of the given object whoe have a property named jcr:primaryType
     * @param resource the resource
     * @returns {any} the sub object
     */
    public static getChildren(resource: any): any {
        let children: any = {};
        Object.keys(resource).forEach((propertyName: string): void => {
            let child = resource[propertyName];
            if (child["jcr:primaryType"]) {
                children[propertyName] = child;
            }
        });
        return children;
    }

}


export interface AemProps {
    wcmmode: string;
    cqHidden?: boolean;
}

/**
 * Provides base functionality for components that are
 */
export class AemComponent<P extends AemProps, S> extends React.Component<P, S> {

    public isWcmEnabled(): boolean {
        return !this.props.wcmmode || this.props.wcmmode !== "disabled";
    }

    public isWcmEditable(): boolean {
        return ["disabled", "preview"].indexOf(this.props.wcmmode) < 0;
    }

    /**
     * change visibility of all nested react component roots.
     * @param path
     * @param visible
     */
    public setAllEditableVisible(path: string, visible: boolean): void {
        component.ComponentManager.INSTANCE.setNestedInstancesVisible(path, visible);
    }

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

/**
 * Provides base functionality for components that are
 */
export class ResourceComponent<C extends Resource, P extends ResourceProps<any>, S> extends AemComponent<P, S> {


    public componentDidMount(): void {
        component.ComponentManager.INSTANCE.addComponent(this);
    }

    public getChildren(): any  {
        let resource = this.props.resource;
        let children: any = {};
        Object.keys(resource).forEach((propertyName: string): void => {
            let child = resource[propertyName];
            if (child["jcr:primaryType"]) {
                children[propertyName] = child;
            }
        });
        return children;
    }

    public getResource(): C {
        return this.props.resource;
    }

    public getResourceType(): string {
        return this.getResource()["sling:resourceType"];
    }

    public createNewChildNodeNames(prefix: String, count: number): string[] {
        let newNodeNames: string[] = [];
        let existingNodeNames: string[] = Object.keys(this.getChildren());

        for (let idx: number = 0; idx < count; idx++) {
            let nodeName: string = null;
            let index: number = idx;
            while (nodeName === null || existingNodeNames.indexOf(nodeName) >= 0) {
                nodeName = prefix + "_" + (index++);
            }
            newNodeNames.push(nodeName);
            existingNodeNames.push(nodeName);
        }
        return newNodeNames;
    }

}


export interface ScriptProps extends AemProps {
    js: string;
}

export class Script extends AemComponent<ScriptProps, any> {
    public render(): React.ReactElement<any> {
        return React.createElement("script", {dangerouslySetInnerHTML: {__html: this.props.js}});
    }
}

export interface CqEditProps extends AemProps {
    path: string;
    resourceType: string;
    dialog?: string;
    editConfig?: any;
}

export declare type WcmModeListener = (wcmmode: string) => void;

export class CqEdit extends AemComponent<CqEditProps, any> {

    public render(): React.ReactElement<any> {
        if (this.props.wcmmode === "disabled") {
            return null;
        } else {
            let dialog = this.props.dialog || "/apps/" + this.props.resourceType + "/dialog";
            let json = {
                "path": this.props.path, "dialog": dialog, "type": this.props.resourceType, editConfig: this.props.editConfig

            };

            let js: string = "CQ.WCM.edit(" + JSON.stringify(json) + ");";
            return <Script js={js} wcmmode={this.props.wcmmode}/>;
        }
    }

}


export class Cq {
    public static on(event: string, cb: WcmModeListener, ctx: any): void {
        if (typeof window !== "undefined" && window.CQ) {
            window.CQ.WCM.getTopWindow().CQ.WCM.on(event, cb, this);
        }
    }

    public static register(component: AemComponent<any, any>): void {
        let cb = function (wcmmode: string): void {
            // TODO use rendere
            component.props.wcmmode = wcmmode;
            component.forceUpdate();
        }.bind(this);
        Cq.on("wcmmodechange", cb, null);

    }

}

export interface EditMarkerProps extends AemProps {
    label?: string;
}

export class EditMarker extends AemComponent<EditMarkerProps, any> {
    public render(): React.ReactElement<any> {
        if (this.props.wcmmode === "edit") {
            return <h3 className="placeholder">{this.props.label}</h3>;
        } else {
            return null;
        }
    }
}
