import * as aem from './aem';
import * as React from 'react';
export interface IncludeProps extends aem.AemProps {
    path: string;
    resourceType: string;
    element?: string;
    hidden?: boolean;
}
export declare class ResourceInclude extends aem.AemComponent<IncludeProps, any> {
    componentDidMount(): void;
    render(): React.DOMElement<{
        "data-always-hidden": boolean;
        hidden: boolean;
        dangerouslySetInnerHTML: {
            __html: string;
        };
    }>;
}
