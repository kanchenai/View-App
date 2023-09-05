import Application from "../core/frame/app/Application";
import AliWebPlayer from "@src/util/AliWebPlayer";
import LocalData from "@core/frame/util/LocalData";
import IptvPlayer from "@src/util/IptvPlayer";

export default class MyApplication extends Application {

    /**
     * 根据参数来判断
     * @param param
     * @returns {boolean}
     */
    forceEnter(param) {
        var flag = false;
        if(param.enter || param.demo == "1"){//当参数中key为enter有值时，或以demo形式进入
            flag = true;
        }
        return flag;
    }

    onLaunch(urlParam) {
        console.log("onLaunch，地址栏参数：", urlParam);
        var backUrl = urlParam.backUrl;
        if (!backUrl) {//如果在地址栏中没有返回地址
            LocalData.setData("backUrl",backUrl);//取保存的
        }

        var param = {data: "enter"};//将地址栏参数中与firstPage相关的参数填到param，会在firstPage中获取到

        return {firstPage: urlParam.pageName, param: param};
    }

    onCreate(page, param) {
        //这里可以获取盒子型号、userName等盒子相关的信息、以及其他的全局数据
        //根据型号开启动画也可以在这里设置
        // console.log("MyApplication onCreate");
    }

    onStop() {
        // console.log("MyApplication onStop")
    }

    onDestroy() {
        // console.log("MyApplication onDestroy")

        return 0;//返回一个推出延迟时间（毫秒）
    }

    exitUrl() {
        var url = this.urlParam.backUrl;
        if (!url) {//如果在地址栏中没有返回地址
            url = LocalData.getData("backUrl");//取保存的
        }

        if (!url || url == "undefined") {//如果都没有
            url = "";//默认的地址
        }

        // 如果是app+epg，在这里调用退出app的方法

        return url;
    }

    getPlayerInstance() {
        var player = {};
        try {
            var stbType = "";//获取盒子型号
            player = new IptvPlayer(stbType);//传入盒子型号
        } catch (e) {
            player = new AliWebPlayer();
        }
        return player;
    }
}
