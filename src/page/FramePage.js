import Page from "../../core/frame/page/Page";

import Fragment_0 from "@fragment/Fragment_0";
import Fragment_1 from "@fragment/Fragment_1";
import Fragment_2 from "@fragment/Fragment_2";

export default class FramePage extends Page{
    onCreate(param) {
        this.html = require("../html/frame.html");

        this.initView();
    }

    initView(){
        this.bg = this.findViewById("bg");

        this.frame_view = this.findViewById("frame_view");
        this.frame_view.addFragmentList([
            new Fragment_0(this.viewManager),
            new Fragment_1(this.viewManager),
            new Fragment_2(this.viewManager)
        ]);
    }

    onFocusChangeListener(view, hasFocus) {
        if(!hasFocus){
            return;
        }

        switch (view.id){
            case "button_0":
                this.frame_view.switchTo(0);
                break;
            case "button_1":
                this.frame_view.switchTo(1);
                break;
            case "button_2":
                this.frame_view.switchTo(2);
                break;
        }
    }
}
