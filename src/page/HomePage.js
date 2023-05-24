import Page from "@core/frame/page/Page";
import {Adapter} from "@core/frame/view/group/RecycleView";
import WaterFallPage from "@page/WaterFallPage";

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
        this.list_0.onClickListener = onClickListenerList0;
        this.list_1.onClickListener = onClickListenerList1;
        this.list_2.onClickListener = onClickListenerList2;
    }

    initUtil() {
        this.list_0.data = [
            "PageName跳转", "跳转带参数", "Page跳转",
            "单瀑布流Page", "横向滚动Page", "多瀑布流Page",
        ];
        this.list_1.data = [
            "ItemView", "GroupView", "FrameView",
            "RecycleView", "Dialog", "ImageView",
            "LogView", "PlayerView", "TextView",
            "Toast"];
        this.list_2.data = [
            "Button", "Poster", "Keyboard",
            "CountdownView", "CarouselView"
        ];
        this.list_3.data = ["Launcher", "爱奇艺", "芒果", "直播"];
    }

    onClickListener(view) {
        this.i(view.data)
        if (view.fatherView.fatherView == this.list_2) {
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

var onClickListenerList0 = function (view) {
    var index = this.list_0.selectIndex;

    var page = "TestPage";
    var param = null;

    switch (index) {
        case 0:
            page = "WaterFallPage";
            break;
        case 1:
            page = "WaterFallPage";
            param = {data: "HomePage传递的数据"}
            break;
        case 2:
            page = new WaterFallPage();
            break;
        case 3:
            page = "WaterFallPage";
            break;
        case 4:
            break;
        case 5:
            break;
    }

    this.startPage(page, param)
}

var onClickListenerList1 = function (view) {
    var index = this.list_1.selectIndex;

    var page = "TestPage";
    var param = null;

    switch (index) {
        case 0:
            page = "ItemPage";
            break;
        case 1:
            page = "GroupPage";
            break;
        case 2:
            page = "FramePage";
            break;
        case 3:
            page = "RecyclePage";
            break;
        case 4:
            page = "DialogPage";
            break;
        case 5:
            page = "ImagePage";
            break;
        case 6:
            page = "LogPage";
            break;
        case 7:
            page = "PlayerPage";
            break;
        case 8:
            page = "TextPage";
            break;
        case 9:
            page = "ToastPage";
            break;
    }

    this.startPage(page, param)
}

var onClickListenerList2 = function (view) {
    var index = this.list_2.selectIndex;

    var page = "TestPage";
    var param = null;

    switch (index) {
        case 0:
            page = "ButtonPage";
            break;
        case 1:
            page = "PosterPage";
            break;
        case 2:
            page = "KeyboardPage";
            break;
        case 3:
            page = "CountdownPage";
            break;
        case 4:
            break;
        case 5:
            break;
    }

    this.startPage(page, param)
}
