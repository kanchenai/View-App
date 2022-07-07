import Application from "../core/frame/app/Application";
import HomePage from "./page/HomePage";
import ListPage from "./page/ListPage";
import TestPage from "./page/TestPage"
import IptvPlayer from "@core/frame/player/IptvPlayer";
import FramePage from "@page/FramePage";
import WebPlayer from "@src/util/WebPlayer";
import {PlayInfo} from "@core/frame/player/VideoPlayer";

require('./global_style.css')

export default class MyApplication extends Application {
    constructor(id) {
        super(id);
        this.pageManager.pageTypeCallback = function (pageName) {
            var page = null;
            switch (pageName) {
                case "HomePage":
                    page = new HomePage();
                    break;
                case "ListPage":
                    page = new ListPage();
                    break;
                case "TestPage":
                    page = new TestPage();
                    break;
            }
            return page;
        }
    }

    onLaunch(urlParam) {
        console.log("onLaunch，地址栏参数：", urlParam);
        var firstPage = null;
        var param = null;
        switch (urlParam.pageKey) {
            case "home":
                firstPage = new HomePage();
                break;
            case "test":
                    firstPage = new TestPage();
                break;
            default:
                firstPage = new HomePage();
                break;
        }
        return {firstPage, param};
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
        var url = "";
        if (false) {
            url = "http://www.baidu.com";
        } else {
            url = "";
        }
        return url;
    }

    getPlayerInstance() {
        var player = {};
        try{
            player = new IptvPlayer(this.keyboard);
        }catch (e){
            player = new WebPlayer();
        }
        return player;
    }
}
