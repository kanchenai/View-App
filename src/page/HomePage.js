import Page from "@core/frame/page/Page";
import {Adapter} from "@core/frame/view/group/RecycleView";

export default class HomePage extends Page {
    onCreate(param) {
        console.log(this.pageName, "onCreate", "传入参数", param);
        this.html = require("../html/home.html");
        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.bg = this.findViewById("bg")
        this.bg.src = require("../images/bg.jpg")

        this.list_0 = this.findViewById("list_0");
        this.list_0.adapter = new ListAdapter();

        this.list_1 = this.findViewById("list_1");
        this.list_1.adapter = new ListAdapter();

        this.list_2 = this.findViewById("list_2");
        this.list_2.adapter = new ListAdapter();

        this.list_3 = this.findViewById("list_3");
        this.list_3.adapter = new ListAdapter();
    }

    setView() {
    }

    initUtil() {
        this.list_0.data = ["PageName跳转", "跳转带参数", "Page跳转"];
        this.list_1.data = [
            "ItemView", "GroupView", "FrameView",
            "RecycleView", "Dialog", "ImageView",
            "LogView", "PlayerView", "TextView",
            "Toast"];
        this.list_2.data = ["Button", "PosterWhiteView", "KeyboardView", "CountdownView"];
        this.list_3.data = ["Launcher", "爱奇艺", "芒果", "直播"];
    }

    onClickListener(view) {
        if (view.fatherView.fatherView == this.list_0) {

        } else if (view.fatherView.fatherView == this.list_0) {
        } else if (view.fatherView.fatherView == this.list_0) {
        } else {
            var url = "";
            switch (view.data) {
                case "Launcher":
                    url = "http://kanchenai.gitee.io/launcher_page";
                    break;
                case "爱奇艺":
                    url = "http://kanchenai.gitee.io/aiqiyi_page";
                    break;
                case "芒果":
                    url = " http://kanchenai.gitee.io/mango_page";
                    break;
                case "直播":
                    url = "http://kanchenai.gitee.io/live-page";
                    break;
            }

            url += "?backUrl=" + encodeURIComponent(location.href);

            this.application.gotoOutside(url);
        }

    }

    onResume() {
        console.log(this.pageName + "-onResume");
    }

    onPause() {
        console.log(this.pageName + "-onPause");

        var newParam = {data: "HomePage保存的数据"};
        this.saveParam(newParam);
    }

    onStop() {
        console.log(this.pageName + "-onStop");
    }

    onDestroy() {
        console.log(this.pageName + "-onDestroy");
    }
}

class ListAdapter extends Adapter {
    bindHolder(holder, data) {
        var button = holder.findViewById("button");
        button.value = data;
    }
}
