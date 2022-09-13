import LoneDialog from "@core/frame/view/group/LoneDialog";
import html from "@html/dialog/confirm_dialog.html"

export default class ConfirmDialog extends LoneDialog {
    constructor(viewManager) {
        super(viewManager);
        this.html = html;

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
        console.log("点击",view);
    }

}