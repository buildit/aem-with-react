import * as Aem from "./aem";

export interface ContentModel {
    label: string;
    node: string;
    resourceType: string;
}

export interface StackState {
    activeIndex: number;
}


export abstract class StackContainer extends Aem.ResourceComponent<Aem.Resource, Aem.ResourceProps<Aem.Resource>, StackState> {


    constructor(props: Aem.ResourceProps<Aem.Resource>) {
        super(props);
        // TODO remove this
        this.state = {activeIndex: 0};
        // TODO move this to ComponentManager
    }


    public getContentModel(content: any): ContentModel[] {
        let contentModel: ContentModel[] = [];

        let children: any = Aem.ResourceUtils.getChildren(content);
        Object.keys(children).forEach(function (key: string, idx: number): void {
            let child: any = children[key];
            let label: string = child.label || "set label please";
            let resourceType: string = child["sling:resourceType"];
            contentModel.push({node: key, label: label, resourceType: resourceType});
        }, this);

        return contentModel;
    };

}
