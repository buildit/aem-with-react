interface Editable {
    show():void;
    hide():void;
}
interface Wcm {
    getEditable(path:string):Editable;
    getTopWindow():{CQ:Cq};
    on(event:string, callback:any, ctx:any):void;
}
interface Cq {
    WCM:Wcm;
}

declare var CQ:Cq;

export default class CqUtils {
    /**
     * hide or show the editable at the path.
     */
    static setVisible(path:string, visible:boolean) {
        var editable = CQ.WCM.getEditable(path);
        if (editable) {
            if (visible) {
                editable.show();
            } else {
                editable.hide();
            }
        } else {
            var cb = function () {
                CqUtils.setVisible(path, visible);
            }
            if (typeof window !== "undefined" && CQ) {
                CQ.WCM.getTopWindow().CQ.WCM.on("editablesready", cb, this);
            }
        }
    }
}

