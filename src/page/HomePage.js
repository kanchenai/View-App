import Page from "@core/frame/page/Page";

export default class HomePage extends Page {
    onCreate(param) {
        console.log(this.pageName, "onCreate", "传入参数", param);
        this.html = require("../html/home.html");
        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.bg = this.findViewById("bg")
        this.bg.src = require("../images/bg.jpg")
    }

    setView() {
    }

    initUtil(){

    }

    onClickListener(view) {
    }

    onResume() {
        console.log(this.pageName + "-onResume");
    }

    onPause() {
        console.log(this.pageName + "-onPause");

        var newParam = {data:"HomePage保存的数据"};
        this.saveParam(newParam);
    }

    onStop() {
        console.log(this.pageName + "-onStop");
    }

    onDestroy() {
        console.log(this.pageName + "-onDestroy");
    }
}
