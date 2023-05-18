import {Adapter} from "@core/frame/view/group/RecycleView";

export default class AdapterDemo extends Adapter{
    constructor() {
        super();
        this.template = require("../html/adapter/adapter_demo.html")
    }

    bindHolder(holder, data) {

    }
}
