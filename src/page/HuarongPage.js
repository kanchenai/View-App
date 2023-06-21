import Page from "@core/frame/page/Page";

export default class HuarongPage extends Page {
    onCreate(param) {
        this.html = require("../html/huarong.html")
        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.gaming = false;

        this.huarong = this.findViewById("huarong");
        this.pic = this.findEleById("pic");
        this.tips = this.findEleById("tips");
        this.tips_1 = this.findEleById("tips_1");
        this.gameSize = this.findEleById("size");
        this.start = this.findViewById("start");
    }

    setView() {

    }

    initUtil() {
        var pic = require("../images/pic.png");
        this.huarong.pic = pic
        this.pic.src = pic;

        this.gameSize.innerText = this.huarong.col;

        this.refreshTips();
    }

    refreshTips(){
        if(this.gaming) {
            this.tips.innerText = "游戏进行中";
            this.tips_1.style.display = "";
        }else{
            this.tips.innerText = "游戏未开始";
            this.tips_1.style.display = "none";
        }
    }

    onClickListener(view) {
        switch (view.id){
            case "-":
                var size = parseInt(this.gameSize.innerText);
                if(size > 2){
                    size--;
                }
                this.gameSize.innerText = size;
                break;
            case "+":
                var size = parseInt(this.gameSize.innerText);
                size++;
                this.gameSize.innerText = size;
                break;
            case "reset":
                var size = parseInt(this.gameSize.innerText);
                this.huarong.col = size;
                this.huarong.initData();
                break;
            case "start":
                this.gaming = true;
                this.huarong.start();
                this.refreshTips();
                view.hide();
                break;
        }
    }

    onSuccessListener(huarongView) {
        this.i("游戏成功")
    }

    key_up_event() {
        if(this.gaming){
            this.huarong.up();
        }else{
            super.key_up_event();
        }
    }

    key_down_event() {
        if(this.gaming){
            this.huarong.down();
        }else{
            super.key_down_event();
        }
    }

    key_left_event() {
        if(this.gaming){
            this.huarong.left();
        }else{
            super.key_left_event();
        }
    }

    key_right_event() {
        if(this.gaming){
            this.huarong.right();
        }else{
            super.key_right_event();
        }
    }

    key_back_event() {
        if(this.gaming){
            this.gaming = false;
            this.start.show();
            this.refreshTips();
        }else{
            super.key_back_event();
        }
    }
}