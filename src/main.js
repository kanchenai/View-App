import '@css'
import "@images-js"
require('./global_style.css')

import MyApplication from "./MyApplication";
import State from "@core/frame/util/State";

var start = new Date().getTime();
window.onload = function () {
    State.ScrollAnimation = true;//控制滚动动画开关
    //需要在css加载完之后才能启动app
    window.application = new MyApplication("app");
    window.application.launch();

    //调试结束后，可以改成这样的写法，全局无法获取到application对象，安全性更高
    // var application = new MyApplication("app");
    // application.launch();

    console.log(new Date().getTime() - start)
}

