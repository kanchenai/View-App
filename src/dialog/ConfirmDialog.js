import LoneDialog from "@core/frame/view/group/LoneDialog";

export default class ConfirmDialog extends LoneDialog {
    constructor(viewManager) {
        super(viewManager);
        this.html = require("@html/dialog/confirm_dialog.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView(){
        this.confirm = this.findViewById("confirm");
        this.cancel = this.findViewById("cancel");

    }
    setView(){}
    initUtil(){}


    onClickListener(view){
        // this.page.i(view.id);
        switch (view.id){
            case "cancel":
                this.hide();
                break;
            case "confirm":
                this.hide();
                break;
        }
    }

}
