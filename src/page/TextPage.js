import Page from "@core/frame/page/Page";

export default class TextPage extends Page{
    onCreate(param) {
        this.html = require("../html/text.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView(){
        this.text_info = this.findViewById("text_info");
        this.poster = this.findViewById("poster");
    }
    setView(){}
    initUtil(){

        this.poster.data = {
            poster:require("../images/poster.png"),
            name:"这是一段海报的文字，然后加长加长加长"
        }
    }

    onClickListener(view) {
        switch (view.id){
            case "btn_marquee":
                this.text_info.marquee();
                break;
            case "btn_cancel":
                this.text_info.clearMarquee();
                break;
        }
    }
}
