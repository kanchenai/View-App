import Page from "@core/frame/page/Page";

export default class ProgressPage extends Page {
    onCreate(param) {
        this.html = require("../html/progress.html")

        this.progress = this.findViewById("progress");

        this.progress.progress = 50;
    }

    onClickListener(view) {
        switch (view.id) {
            case "add":
                this.progress.progress++
                break;
            case "subtract":
                this.progress.progress--;
                break;
        }
    }
}