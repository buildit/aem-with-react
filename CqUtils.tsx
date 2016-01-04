interface CqElement {
    dom: any;
}

interface Editable {
    element: CqElement;
    show(skipNested?: boolean): void;
    hide(skipNested?: boolean): void;
    createParagraph(cfg: any): void;
    refresh(): void;
}
interface Wcm {
    getEditable(path: string): Editable;
    unregisterEditable(path: string): void;
    getTopWindow(): {CQ: Cq};
    on(event: string, callback: any, ctx: any): void;
    getNestedEditables(path: String): string[];
}
interface Cq {
    WCM: Wcm;
}

declare var CQ: Cq;

export default class CqUtils {
    /**
     * hide or show the editable at the path.
     */
    public static setVisible(path: string, visible: boolean, recursive: boolean = true): void {
        // TODO TouchUI : $("[data-path='/content/react-demo/demo/jcr:content/par/*']").hide()
        if (typeof CQ !== "undefined") {
            let editable = CQ.WCM.getEditable(path);
            if (editable) {

                if (visible) {
                    editable.show(true);
                } else {
                    editable.hide(true);
                }
            } else {
                let cb = function (): void {
                    CqUtils.setVisible(path, visible, recursive);
                };
                // TODO remove listeners
                CQ.WCM.on("editablesready", cb, this);
                CQ.WCM.getTopWindow().CQ.WCM.on("editablesready", cb, this);
                setTimeout(cb, 0);
            }
        }
    }

    /**
     * add a child to a Dnd-Zone. Usually the Dnd-Zone is hidden.
     */
    public static addChild(ctx: any, relPath: string, resourceType: string): void {
        // TODO TouchUi: Granite.author.persistence.createParagraph()
        let e: Editable = CQ.WCM.getEditable(ctx.path + relPath + "/*");
        e.createParagraph({
            resourceType: resourceType
        });
    }


    public static refresh(path: string): void {
        let e: Editable = CQ.WCM.getEditable(path);
        e.refresh();
    }

    public static removeEditable(path: string): void {
        CQ.WCM.unregisterEditable(path);
    }
}

