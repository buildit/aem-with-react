import * as React from 'react';

export interface IncludeProps {
    path: string;
    resourceType: string;
    element?:string;
    hidden?:boolean;
}

export class ResourceInclude extends React.Component<any, any> {

    render() {


        var innerHTML:string = "{{{include-resource \"" + this.props.path + "\" \"" + this.props.resourceType + "\"}}}"

        if (!!this.props.hidden) {
            innerHTML += "<script>Hal.setVisibility('" + this.props.path + "',false)</script>";
        }

        return React.createElement(this.props.element || "div", {
            hidden: !!this.props.hidden, dangerouslySetInnerHTML: {__html: innerHTML}
        });


    }

}
