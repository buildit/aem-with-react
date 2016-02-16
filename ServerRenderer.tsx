import * as React from "react";
import RootComponent from "./RootComponent";
import RootComponentRegistry from "./RootComponentRegistry";
import AemContext from "./AemContext";

export default class ServerRenderer {

    constructor(registry: RootComponentRegistry) {
        this.registry = registry;
    }

    private registry: RootComponentRegistry;


    /* render component as string.
     * @param component
     * @param props
     * @returns {string}
     */
    public renderReactComponent(resourceType: string, props: any): string {
        let rt: string = props.resource["sling:resourceType"];

        let comp: typeof React.Component = this.registry.getComponent(rt);
        if (!comp) {
            throw new Error("cannot find component for resourceType " + rt);
        }
        console.log("rendering " + rt + " " + comp.name);
        let ctx: AemContext = {registry: this.registry};
        return React.renderToString(<RootComponent aemContext={ctx} comp={comp} {...props} />);
    }

}
