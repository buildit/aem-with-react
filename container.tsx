import * as Aem from './aem';
import * as React from 'react';

export interface ContentModel {
    label: string;
    node:string;
    resourceType:string;
}

export interface StackState {
    activeIndex: number;
}


export class StackContainer extends Aem.ResourceComponent<Aem.Resource,Aem.ResourceProps<Aem.Resource>, StackState> {


    constructor(props:Aem.ResourceProps<Aem.Resource>) {
        super(props);
        this.state = {activeIndex: 0}
        Aem.Cq.register(this);
    }


    getContentModel(content:any):ContentModel[] {
        let contentModel:ContentModel[] = [];

        var children:any = Aem.ResourceUtils.getChildren(content);
        Object.keys(children).forEach(function (key:string, idx:number) {
            var child:any = children[key];
            var label:string = child.label || "set label please";
            let resourceType:string = child["sling:resourceType"];
            contentModel.push({node: key, label: label, resourceType: resourceType});
        }, this);

        return contentModel;
    };

}
