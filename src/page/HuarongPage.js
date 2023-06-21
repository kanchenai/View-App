import Page from "@core/frame/page/Page";

export default class HuarongPage extends Page{
    onCreate(param) {
        this.html = require("../html/huarong.html")
        this.huarong = this.findViewById("huarong");
        this.huarong.pic = require("../images/pic.png");
    }

    onSuccessListener(huarongView){
        this.i("游戏成功")
    }

    key_up_event() {
        this.huarong.up();
    }

    key_down_event() {
        this.huarong.down();
    }

    key_left_event() {
        this.huarong.left();
    }

    key_right_event() {
        this.huarong.right();
    }
}