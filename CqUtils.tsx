
interface CqElement {
    dom:any;
}

interface Editable {
    element:CqElement;
    show(skipNested?:boolean):void;
    hide(skipNested?:boolean):void;
    createParagraph(cfg:any):void;
}
interface Wcm {
    getEditable(path:string):Editable;
    getTopWindow():{CQ:Cq};
    on(event:string, callback:any, ctx:any):void;
    getNestedEditables(path:String):string[];
}
interface Cq {
    WCM:Wcm;
}

declare var CQ:Cq;

export default class CqUtils {
    /**
     * hide or show the editable at the path.
     */
    static setVisible(path:string, visible:boolean, recursive:boolean=true) {
        // TODO TouchUI : $("[data-path='/content/react-demo/demo/jcr:content/par/*']").hide()
        if (typeof CQ !== "undefined") {
            var editable = CQ.WCM.getEditable(path);
            if (editable) {

                    var descendents = CQ.WCM.getNestedEditables(path);
                    for (var idx = 0;
                         idx < descendents.length;
                         idx++) {
                        var b = CQ.WCM.getEditable(descendents[idx]);
                        if (b) {
                            let alwaysHidden = b.element.dom.parentNode.getAttribute("data-always-hidden")=="true";
                            if (!alwaysHidden) {
                                this.setVisible(descendents[idx], visible, false);
                            }
                        }
                    }



                if (visible) {
                    editable.show(true);
                } else {
                    editable.hide(true);
                }
            } else {
                var cb = function () {
                    CqUtils.setVisible(path, visible, recursive);
                }
                // TODO remove listeners
                CQ.WCM.on("editablesready", cb, this);
                CQ.WCM.getTopWindow().CQ.WCM.on("editablesready", cb, this);
                setTimeout(cb,0);
            }
        }
    }

    /**
     * add a child to a Dnd-Zone. Usually the Dnd-Zone is hidden.
     */
    static addChild(ctx:any, relPath:string, resourceType:string) {
        // TODO TouchUi: Granite.author.persistence.createParagraph()
        var e:Editable = CQ.WCM.getEditable(ctx.path + relPath + "/*");
        e.createParagraph({
            resourceType : resourceType
        });
    }
}

