import Page from "@core/frame/page/Page";
import ListPage from "@page/ListPage";

import HomeFragment_0 from "@fragment/HomeFragment_0";
import HomeFragment_1 from "@fragment/HomeFragment_1";
import HomeFragment_2 from "@fragment/HomeFragment_2";
import HomeFragment_3 from "@fragment/HomeFragment_3";
import HomeFragment_4 from "@fragment/HomeFragment_4";
import HomeFragment_5 from "@fragment/HomeFragment_5";

import html from "@html/home.html"
import ConfirmDialog from "@src/dialog/ConfirmDialog";
import utils from "@src/util/utils";

export default class HomePage extends Page {
    constructor() {
        super();
        this.pageName = "HomePage";
    }

    onCreate(param) {
        this.html = html;
        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.focusId = "top_record";//在html中有标view-focus，在page的onCreate中有设置focusId，以focusId为准
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

    bgToVideoBg(playInfo){
        utils.bgToVideoBg(this.bg.ele.parentNode,this.bg.ele,playInfo)
    }

    videoBgToBg(){
        utils.videoBgToBg(this.bg.ele.parentNode,this.bg.ele);
    }

    onClickListener(view) {
        console.log(view.pageName, "-onClickListener", view);
        var listPage = new ListPage();
        this.startPage(listPage, {data: "llllll"});
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

    onVisibleChangeListener(view, isShowing) {
        console.log("显示监听", isShowing, view);
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
