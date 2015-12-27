import * as Aem from './aem';
export interface ContentModel {
    label: string;
    node: string;
    resourceType: string;
}
export interface StackState {
    activeIndex: number;
}
export declare class StackContainer extends Aem.ResourceComponent<Aem.Resource, Aem.ResourceProps<Aem.Resource>, StackState> {
    constructor(props: Aem.ResourceProps<Aem.Resource>);
    getContentModel(content: any): ContentModel[];
}
