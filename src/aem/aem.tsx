import * as React from 'react';


interface CqWindow extends Window {
    CQ: any;
}

declare var window:CqWindow;

export class ResourceUtils {

    /**
     * returns only the properties of the given object whoe have a property named jcr:primaryType
     * @param resource the resource
     * @returns {any} the sub object
     */
    static getChildren(resource: any) {
        var children: any={};
        Object.keys(resource).forEach(function(propertyName: string) {
            var child = resource[propertyName];
            if (child["jcr:primaryType"]) {
                children[propertyName] = child;
            }
        })
        return children;
    }

}



export interface AemProps {
    wcmmode:string;
}

/**
 * Provides base functionality for components that are
 */
export class AemComponent<P extends AemProps, S> extends React.Component<P, S> {


    isWcmEnabled() {
        return !this.props.wcmmode || this.props.wcmmode !== "disabled";
    }

    isWcmEditable() {
        return ["disabled", "preview"].indexOf(this.props.wcmmode) < 0;
    }

}


export interface ResourceProps<C> extends AemProps {
    resource: C;
    component?:string;
    path:string;
}

/**
 * Provides base functionality for components that are
 */
export class ResourceComponent<C, P extends ResourceProps<any>, S> extends AemComponent<P, S> {


    getChildren() {
        var resource = this.props.resource;
        var children:any = {};
        Object.keys(resource).forEach(function (propertyName:string) {
            var child = resource[propertyName];
            if (child["jcr:primaryType"]) {
                children[propertyName] = child;
            }
        })
        return children;
    }

    getResource():C {
        return this.props.resource;
    }


    createNewChildNodeNames(prefix:String, count: number):string[] {
        var index:number = 1;
        var newNodeNames:string[]=[];
        var existingNodeNames:string[]=Object.keys(this.getChildren())

        for (let idx:number=0;idx<count;idx++) {
            var nodeName:string = null;
            var index=idx;
            while (nodeName === null || existingNodeNames.indexOf(nodeName)>=0) {
                nodeName = prefix + "_" + (index++);
            };
            newNodeNames.push(nodeName);
            existingNodeNames.push(nodeName);
        }
        return newNodeNames;
    }

}


export interface ScriptProps extends AemProps {
    js:string;
}

export class Script extends AemComponent<ScriptProps,any> {
    render() {
        return React.createElement("script", {dangerouslySetInnerHTML: {__html: this.props.js}});
    }
}

export interface CqEditProps extends AemProps {
    path:string;
    resourceType:string;
    dialog?:string;
}

export declare type WcmModeListener = (wcmmode:string) => void;

export class CqEdit extends AemComponent<CqEditProps,any> {

    render() {
        if (this.props.wcmmode == "disabled") {
            return null;
        } else {
            var dialog = this.props.dialog || this.props.resourceType + "/dialog";
            var json = {
                "path": this.props.path,
                "dialog": dialog,
                "type": this.props.resourceType
            };

            var js:string = "CQ.WCM.edit(" + JSON.stringify(json) + ");";
            return <Script js={js} wcmmode={this.props.wcmmode}/>;
        }
    }

}


export class Cq {
    static on(event:string, cb:WcmModeListener, ctx:any):void {
        if (typeof window !== "undefined" && window.CQ) {
            window.CQ.WCM.getTopWindow().CQ.WCM.on(event, cb, this);
        }
    }

    static register(component:AemComponent<any,any>):void {
        var cb = function (wcmmode:string) {
            component.props.wcmmode = wcmmode;
            component.forceUpdate();
        }.bind(this);
        Cq.on("wcmmodechange", cb, null);

    }
}

export interface EditMarkerProps extends AemProps {
    label?:string;
}

export class EditMarker extends AemComponent<EditMarkerProps,any>{
    render() {
        if (this.props.wcmmode == "edit") {
            return <h3 className="placeholder">{this.props.label}</h3>
        } else {
            return null;
        }
    }
}
