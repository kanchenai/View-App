import Page from "@core/frame/page/Page";
import Toast from "@core/frame/view/single/Toast";

export default class ToastPage extends Page{
    onCreate(param) {
        this.html = require("../html/toast.html");

        this.toast = new Toast(this);
    }

    onClickListener(view) {
        this.toast.show("这是一条提示信息")
    }
}
