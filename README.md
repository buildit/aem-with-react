# AEM React integration module

This npm module  is required by the [AEM React Integration project](http://www.github.com/sinnerschrader/aem-react-js).
This library is written in TypeScript.

## Basic usage

The ComponentManager finds react components defined in the mark up and instantiates them. The markup must provide the following:

```html
...
<div id="MyReactComponent" data-react-id="<path>_component">
</div>
```   

<path> is usually the jcr resource path of the associated AEM component.

The Rect component props are a json string inside of a textarea:

```html
<textarea id="<path>_component">
{
    "component":"MyReactComponent",
    "path":"/content/demo/jcr:content/par/a",
    "root":true,
    "resource":{
        "text":"This is a text"
    }
}
</textarea>

``` 

To initialize the component the ComponentManager is used:

```javascript

var mgr = ComponentManager.INSTANCE;
mgr.init({server:false}); 
mgr.initReactComponent(document.getElementById("MyReactComponent")); 


```  


## API

![the model](model.png)
