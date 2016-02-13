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




}
