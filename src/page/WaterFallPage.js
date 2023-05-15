import Page from "@core/frame/page/Page";

export default class WaterFallPage extends Page {
    onCreate(param) {
        this.html = require("../html/water_fall.html");

        this.i(JSON.stringify(param));
    }
}
