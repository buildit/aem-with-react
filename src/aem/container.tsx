import * as Aem from '../aem/aem';
import * as React from 'react';


export interface ContentModel {
    label: string;
    node:string;
}

export interface StackState {
    activeIndex: number;
}


export class StackContainer extends Aem.ResourceComponent<any,Aem.ResourceProps<any>, StackState> {


    constructor(props:Aem.ResourceProps<any>) {
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
            contentModel.push({node: key, label: label});
        }, this);

        return contentModel;
    };

}
