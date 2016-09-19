import * as React from "react";
import { Resource, ResourceComponent, ResourceProps } from "./component/ResourceComponent";
import { ResourceUtils } from "./ResourceUtils";
import { ResourceInclude } from "./include";
import CqUtils from "./CqUtils";

export default class BaseComponent extends ResourceComponent<Resource, ResourceProps<Resource>, any> {
  protected fixedComponents: Array<any> = [];
  private keyRef: number = 0;

  constructor( props: ResourceProps<Resource> ) {
    super(props);
  }

  protected generateKeyRef(): string {
    return "reactAEM" + this.keyRef++;
  }

  // Check if the given component is one of the fixed type ones
  protected isFixedComponent(componentType: string): Boolean {
    for ( let i = 0; i < this.fixedComponents.length; i++ ) {
      if ( this.fixedComponents[i].toLowerCase() == componentType.toLowerCase() ) {
        return true;
      }
    }

    return false;
  }

  // Override this to render what you want
  public renderBody(): React.ReactElement<any> {
    let childComponents: React.ReactElement<any>[] = this.renderPrep();
    let newZone: React.ReactElement<any> = this.createNewZone();

    return (
      <div>
        {childComponents}
        {newZone}
      </div>
    );
  }

  // Override this to create your components
  protected createChildComponent(resource: Resource, resourceType: string, componentType: any, path: string ): any {
    let props: any = {key: this.generateKeyRef(), path: path, resource: resource};
    let element: any = React.createElement(componentType, props);

    return element;
  }

  protected createNewZone(): any {
    let newZone: React.ReactElement<any> = null;
    if ( this.isWcmEditable() ) {
      let resourceType = this.getResourceType() + "/../react-parsys/new";
      newZone = <ResourceInclude element="div" path={ this.getPath() + "/*" }
      resourceType={ resourceType }></ResourceInclude>;
    }

    return newZone;
  }

  protected renderPrep(): React.ReactElement<any>[] {
    let content: any = this.getResource();
    let children: any = ResourceUtils.getChildren(content);
    let childComponents: React.ReactElement<any>[] = [];

    Object.keys(children).forEach( (nodeName: string, childIdx: number) => {
      let resource: Resource = children[nodeName];
      let resourceType: string = resource["sling:resourceType"];
      let componentType: typeof React.Component = this.getRegistry().getComponent(resourceType);
      let path: string =  nodeName;

      if ( !this.isFixedComponent(path) ) {
        if ( componentType ) {
          const childElement: any = this.createChildComponent(resource, resourceType, componentType, path);
          if ( childElement ) {
            childComponents.push(childElement);
          }
        } else {
          childComponents.push(<ResourceInclude path={path} resourceType={resourceType}></ResourceInclude>);
        }
      }
    }, this);

    if (this.isWcmEditable()) {
      let visible: boolean = !this.isCqHidden();
      CqUtils.setVisible(this.getPath() + "/*", visible, true);
    }

    return childComponents;
  }
}
