import '@css'

require('./global_style.css')

import MyApplication from "./MyApplication";
import State from "@core/frame/util/State";
import Application from "@core/frame/app/Application";
import {KeyboardViewBuilder} from "@src/custom-view/keyborad/KeyboardView";
import {CountdownViewBuilder} from "@src/custom-view/countdown/CountdownView";
import {PosterWhiteViewBuilder} from "@src/custom-view/poster-white/PosterWhiteView";
import {ButtonBuilder} from "@src/custom-view/button/Button";
import {PosterViewBuilder} from "@src/custom-view/poster/PosterView";
import {PosterShadowViewBuilder} from "@src/custom-view/poster-shadow/PosterShadowView";
import {CarouselViewBuilder} from "@src/custom-view/carousel/CarouselView";
import {DrawerViewBuilder} from "@src/custom-view/drawer/DrawerView";
import {ProgressViewBuilder} from "@src/custom-view/progress/ProgressView";
import {FocusViewBuilder} from "@src/custom-view/focus/FocusView";
import {PainterViewBuilder} from "@src/custom-view/painter/PainterView";
import {HuarongViewBuilder} from "@src/custom-view/huarong/HuarongView";


var start = new Date().getTime();
window.onload = function () {
    //添加扩展控件的创建工具
    Application.addCustomViewBuilder([
        KeyboardViewBuilder, CountdownViewBuilder, PosterWhiteViewBuilder,
        ButtonBuilder, PosterViewBuilder, PosterShadowViewBuilder,
        CarouselViewBuilder, DrawerViewBuilder, ProgressViewBuilder,
        FocusViewBuilder,PainterViewBuilder,HuarongViewBuilder
    ]);

    State.ScrollAnimation = true;//控制滚动动画开关
    //需要在css加载完之后才能启动app

    var application = new MyApplication("app");
    window.application = application;//TODO 调试结束后，注释当前行代码，全局无法获取到application对象，安全性更高
    application.launch();

    //使用默认Application启动
    // var application = new Application("app");
    // application.launch();

    var mode = process.env.NODE_ENV || "production";//获取当前的模式,development:开发模式；production：生产模式
    console.log(mode, new Date().getTime() - start)

    console.log("项目地址：")
    console.log("github:https://github.com/kanchenai/View-App.git")
    console.log("gitee:https://gitee.com/kanchenai/View-App.git")

    console.log("View-App介绍说明：")
    console.log("https://kanchenai.gitee.io/view-api-page")

}

