import '@css'
import "@images-js"

import MyApplication from "./MyApplication";

var start = new Date().getTime();
window.onload = function () {
    //需要在css加载完之后才能启动app
    window.application = new MyApplication("app");
    window.application.launch();

    console.log(new Date().getTime() - start)
}

