import Page from "@core/frame/page/Page";
import Toast from "@core/frame/view/single/Toast";

export default class ToastPage extends Page{
    onCreate(param) {
        this.html = require("../html/toast.html");
    }

    onClickListener(view) {
        this.toastInfo("这是一条提示信息");
    }
}
