import Page from "@core/frame/page/Page";

export default class LogPage extends Page{
    onCreate(param) {
        this.html = require("../html/log.html");
    }

    onClickListener(view) {
        switch (view.id){
            case "i":
                this.i("普通信息")
                break;
            case "w":
                this.w("警告信息")
                break;
            case "e":
                this.e("错误信息")
                break;
        }
    }
}
