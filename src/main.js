import '@css'

require('./global_style.css')

import MyApplication from "./MyApplication";
import State from "@core/frame/util/State";
import ViewManager from "@core/frame/view/base/ViewManager";
import {KeyboardViewBuilder} from "@src/custom-view/keyborad/KeyboardView";
import {CountdownViewBuilder} from "@src/custom-view/countdown/CountdownView";
import {PosterWhiteViewBuilder} from "@src/custom-view/poster-white/PosterWhiteView";
import {ButtonBuilder} from "@src/custom-view/button/Button";
import {PosterViewBuilder} from "@src/custom-view/poster/PosterView";
import {PosterShadowViewBuilder} from "@src/custom-view/poster-shadow/PosterShadowView";

var start = new Date().getTime();
window.onload = function () {
    ViewManager.addCustomViewBuilder([
        KeyboardViewBuilder, CountdownViewBuilder, PosterWhiteViewBuilder,
        ButtonBuilder, PosterViewBuilder, PosterShadowViewBuilder
    ]);

    State.ScrollAnimation = true;//控制滚动动画开关
    //需要在css加载完之后才能启动app
    window.application = new MyApplication("app");
    window.application.launch();

    //调试结束后，可以改成这样的写法，全局无法获取到application对象，安全性更高
    // var application = new MyApplication("app");
    // application.launch();
    var mode = process.env.NODE_ENV || "production";//获取当前的模式,development:开发模式；production：生产模式
    console.log(mode, new Date().getTime() - start)
}

