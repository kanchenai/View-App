import Page from "@core/frame/page/Page";

export default class HorizontalWaterFallPage extends Page {
    onCreate(param) {
        this.html = require("../html/horizontal_water_fall.html");
    }
}
