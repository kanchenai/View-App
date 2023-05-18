import Page from "@core/frame/page/Page";
import ConfirmDialog from "@src/dialog/ConfirmDialog";

export default class DialogPage extends Page {
    onCreate(param) {
        this.html = require("../html/dialog.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView(){
        this.dialog_0 = this.findViewById("dialog_0");
        this.dialog_1 = new ConfirmDialog(this.viewManager);
    }
    setView(){}
    initUtil(){}


    onClickListener(view) {
        switch (view.id){
            case "button_1":
                this.dialog_0.show();
                break;
            case "button_2":
                this.dialog_1.show();
                break;
            case "confirm":
                this.dialog_0.hide();
                break;
            case "cancel":
                this.dialog_0.hide();
                break;
        }
    }
}
