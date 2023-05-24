import Page from "@core/frame/page/Page";

export default class CountdownPage extends Page {
    onCreate(param) {
        this.html = require("../html/countdown.html");

        this.initView();
    }

    initView() {
        this.countdown_medium = this.findViewById("countdown_medium");
        this.countdown_small = this.findViewById("countdown_small");
        this.countdown_mini = this.findViewById("countdown_mini");
        this.countdown_custom_size = this.findViewById("countdown_custom_size");
        this.countdown_custom_bg = this.findViewById("countdown_custom_bg");
    }

    onClickListener(view) {
        switch (view.id) {
            case "medium":
                this.countdown_medium.start();
                break;
            case "small":
                this.countdown_small.start();
                break;
            case "mini":
                this.countdown_mini.start();
                break;
            case "custom_size":
                this.countdown_custom_size.start();
                break;
            case "custom_bg":
                this.countdown_custom_bg.start();
                break;
        }
    }

    onCountChangeListener(countdown, count) {
        this.i(countdown.id, count);
    }
}
