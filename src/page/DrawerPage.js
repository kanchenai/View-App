import Page from "@core/frame/page/Page";

export default class DrawerPage extends Page {
    onCreate(param) {
        this.html = require("@html/drawer");
        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.drawer_right = this.findViewById("drawer_right");
        this.drawer_left = this.findViewById("drawer_left");
        this.drawer_bottom = this.findViewById("drawer_bottom");
        this.drawer_top = this.findViewById("drawer_top");

        this.drawer_custom_shadow = this.findViewById("drawer_custom_shadow");
        this.drawer_no_shadow = this.findViewById("drawer_no_shadow");
    }

    setView() {
    }

    initUtil() {
    }

    onClickListener(view) {
        switch (view.id) {
            case "fromRight":
                this.drawer_right.slideIn();
                break;
            case "fromLeft":
                this.drawer_left.slideIn();
                break;
            case "fromBottom":
                this.drawer_bottom.slideIn();
                break;
            case "fromTop":
                this.drawer_top.slideIn();
                break;
            case "custom_shadow":
                this.drawer_custom_shadow.slideIn();
                break;
            case "no_shadow":
                this.drawer_no_shadow.slideIn();
                break;
        }
    }
}