interface Editable {
    show():void;
    hide():void;
}
interface Wcm {
    getEditable(path:string):Editable;
}
interface Cq {
    WCM:Wcm
}

interface Hal {
    setVisibility(path:string, visible:boolean):void;
}


declare var Hal:Hal;

declare var CQ:Cq;

export default class CqUtils {
    static setVisible(path:string, visible:boolean) {
        if (typeof Hal !== "undefined") {
            Hal.setVisibility(path, visible);
        }
    }
}

