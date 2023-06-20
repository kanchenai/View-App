import Page from "@core/frame/page/Page";
import PainterData_0 from "@src/mock-data/PainterData_0";
import PainterData_1 from "@src/mock-data/PainterData_1";

export default class PainterPage extends Page {
    onCreate(param) {
        this.html = require("../html/painter.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.painter = this.findViewById("painter");
        // this.painter.renderBy(PainterData_0);//使用类，简化data
        this.painter.renderBy(PainterData_1);//基本data格式
    }

    setView() {
    }

    initUtil() {


    }

    onClickListener(view) {
        console.log(view.data)
    }
}
