import Page from "@core/frame/page/Page";

export default class ProgressPage extends Page {
    onCreate(param) {
        this.html = require("../html/progress.html")

        this.progress = this.findViewById("progress");
        this.progress_custom_color = this.findViewById("progress_custom_color");
        this.progress_custom = this.findViewById("progress_custom");
    }

    onClickListener(view) {
        switch (view.id) {
            case "add":
                this.progress.progress++
                break;
            case "subtract":
                this.progress.progress--;
                break;

            case "add_custom_color":
                this.progress_custom_color.progress++
                break;
            case "subtract_custom_color":
                this.progress_custom_color.progress--;
                break;

            case "add_custom":
                this.progress_custom.progress++
                break;
            case "subtract_custom":
                this.progress_custom.progress--;
                break;
        }
    }

    onProgressChangeListener(progressView, progress, total) {
        console.log(progressView.id, progress, total);
    }
}