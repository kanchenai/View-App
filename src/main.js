import '@css'
import "@images-js"

import MyApplication from "./MyApplication";
import State from "@core/frame/util/State";

var start = new Date().getTime();
window.onload = function () {
    State.ScrollAnimation = true;//控制滚动动画开关
    //需要在css加载完之后才能启动app
    window.application = new MyApplication("app");
    window.application.launch();

    console.log(new Date().getTime() - start)
}

