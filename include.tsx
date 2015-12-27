import * as aem from './aem';
import * as React from 'react';
import CqUtils from './CqUtils';

export interface IncludeProps extends aem.AemProps{
    path: string;
    resourceType: string;
    element?:string;
    hidden?:boolean;
}

export class ResourceInclude extends aem.AemComponent<IncludeProps, any> {

    componentDidMount() {
        if (this.props.hidden) {
            CqUtils.setVisible(this.props.path, false);
        }
    }

    render() {


        var innerHTML:string = "{{{include-resource \"" + this.props.path + "\" \"" + this.props.resourceType + "\"}}}"

        if (!!this.props.hidden) {
            //innerHTML += "<script>AemReact.setVisibility('" + this.props.path + "',false)</script>";
        }
        if (this.props.hidden) {
            CqUtils.setVisible(this.props.path,false,false);
        }

        return React.createElement(this.props.element || "div", {
            "data-always-hidden": this.props.hidden,
            hidden: !!this.props.hidden,
            dangerouslySetInnerHTML: {__html: innerHTML}
        });


    }

}
