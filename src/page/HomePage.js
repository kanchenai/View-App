import Page from "@core/frame/page/Page";

import HomeFragment_0 from "@fragment/HomeFragment_0";
import HomeFragment_1 from "@fragment/HomeFragment_1";
import HomeFragment_2 from "@fragment/HomeFragment_2";
import HomeFragment_3 from "@fragment/HomeFragment_3";
import HomeFragment_4 from "@fragment/HomeFragment_4";
import HomeFragment_5 from "@fragment/HomeFragment_5";

import html from "@html/home.html"
import ConfirmDialog from "@src/dialog/ConfirmDialog";
import utils from "@src/util/utils";
import LogView, {LEFT_BOTTOM} from "@core/frame/view/single/LogView";

export default class HomePage extends Page {
    onCreate(param) {
        console.log(this.pageName, "onCreate", "传入参数", param);
        this.html = html;
        this.logView.positionMode = LEFT_BOTTOM;
        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.top_record = this.findViewById("top_record");
        this.bg = this.findViewById("bg")

        this.frame_view = this.findViewById("frame_view");
        this.frame_view.addFragmentList([
            new HomeFragment_0(this.viewManager),
            new HomeFragment_1(this.viewManager),
            new HomeFragment_2(this.viewManager),
            new HomeFragment_3(this.viewManager),
            new HomeFragment_4(this.viewManager),
            new HomeFragment_5(this.viewManager)
        ]);
        this.nav_area = this.findViewById("nav_area");
        this.nav_area.selectView = this.nav_area.childViews[0];
        this.nav_area.onClickListener = onNavClickListener;

        // this.dialog = this.findViewById("dialog");
        this.dialog = new ConfirmDialog(this.viewManager);

        if(this.focusView != this.nav_area.selectView){
            this.nav_area.selectView.setSelectStyle();
        }
    }

    setView() {
    }

    initUtil(){

    }

    onClickListener(view) {
        this.logView.i(this.pageName+" id:"+view.id +"加长加长加长加长加长加长加长加长加长加长加长加长")
    }

    onFocusChangeListener(view, hasFocus) {
        // console.log("焦点变化监听", hasFocus, view);
        if(!hasFocus){
            return;
        }
        switch (view.id){
            case "nav_area_0":
                this.frame_view.switchTo(0);
                break;
            case "nav_area_1":
                this.frame_view.switchTo(1);
                break;
            case "nav_area_2":
                this.frame_view.switchTo(2);
                break;
            case "nav_area_3":
                this.frame_view.switchTo(3);
                break;
            case "nav_area_4":
                this.frame_view.switchTo(4);
                break;
            case "nav_area_5":
                this.frame_view.switchTo(5);
                break;
        }
    }

    onScrollStartListener(scrollView, x, y) {
        // console.log("开始滚动", scrollView, x, y);
    }

    onScrollingListener(scrollView, x, y) {
        // console.log("滚动中", scrollView, x, y);
    }

    onScrollEndListener(scrollView, x, y) {
        // console.log("滚动结束", scrollView, x, y);
    }

    onResume() {
        console.log(this.pageName + "-onResume");
    }

    onPause() {
        console.log(this.pageName + "-onPause");

        var newParam = {data:"HomePage保存的数据"};
        this.saveParam(newParam);
    }

    onStop() {
        console.log(this.pageName + "-onStop");
    }

    onDestroy() {
        console.log(this.pageName + "-onDestroy");
    }

    key_back_event() {
        this.dialog.show();
    }
}

var onNavClickListener = function (view){
    console.log(this.pageName, "-onClickListener", view);
    this.startPage("ListPage", {data: "ListPage的初始参数"});

    // this.finish();
}
