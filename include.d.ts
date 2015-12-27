import * as React from 'react';
export interface IncludeProps {
    path: string;
    resourceType: string;
    element?: string;
    hidden?: boolean;
}
export declare class ResourceInclude extends React.Component<any, any> {
    componentDidMount(): void;
    render(): React.DOMElement<{
        "data-always-hidden": any;
        hidden: boolean;
        dangerouslySetInnerHTML: {
            __html: string;
        };
    }>;
}
