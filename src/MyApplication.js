import Application from "../core/frame/app/Application";
import HomePage from "./page/HomePage";
import ListPage from "./page/ListPage";
import TestPage from "./page/TestPage"
import IptvPlayer from "@core/frame/player/IptvPlayer";
import PlayerPage from "@page/PlayerPage";
import AliWebPlayer from "@src/util/AliWebPlayer";
import FramePage from "@page/FramePage";
import LocalData from "@core/frame/util/LocalData";

export default class MyApplication extends Application {
    onLaunch(urlParam) {
        console.log("onLaunch，地址栏参数：", urlParam);
        var firstPage = null;
        var backUrl = urlParam.backUrl;
        if (!backUrl) {//如果在地址栏中没有返回地址
            LocalData.setData("backUrl",backUrl);//取保存的
        }

        var param = {data: "enter"};//将地址栏参数中与firstPage相关的参数填到param，会在firstPage中获取到
        // switch (urlParam.pageKey) {
        //     case "home":
        //         firstPage = new HomePage();
        //         break;
        //     case "list":
        //         firstPage = new ListPage();
        //         break;
        //     case "frame":
        //         firstPage = new FramePage();
        //         break;
        //     case "test":
        //         firstPage = new TestPage();
        //         break;
        //     case "player":
        //         firstPage = new PlayerPage();
        //         break;
        // }

        switch (urlParam.pageKey) {
            case "home":
                firstPage = "HomePage";
                break;
            case "list":
                firstPage = "ListPage";
                break;
            case "frame":
                firstPage = "FramePage";
                break;
            case "test":
                firstPage = "TestPage";
                break;
            case "player":
                firstPage = "PlayerPage";
                break;
        }

        return {firstPage: firstPage, param: param};
    }

    onCreate(page, param) {
        // console.log("MyApplication onCreate");
    }

    onStop() {
        // console.log("MyApplication onStop")
    }

    onDestroy() {
        // console.log("MyApplication onDestroy")
        // 如果是app+epg，在这里（或exitUrl()）调用退出app的方法
    }

    exitUrl() {
        var url = this.urlParam.backUrl;
        if (!url) {//如果在地址栏中没有返回地址
            url = LocalData.getData("backUrl");//取保存的
        }

        if (!url) {//如果都没有
            url = "";//默认的地址
        }
        return url;
    }

    getPlayerInstance() {
        var player = {};
        try {
            player = new IptvPlayer();
        } catch (e) {
            player = new AliWebPlayer();
        }
        return player;
    }
}
