import Fragment from "../../core/frame/view/group/Fragment";

import html from "../html/fragment/home_fragment_0.html"

export default class HomeFragment_0 extends Fragment{
    onCreate() {
        this.html = html;
        console.log("HomeFragment_0",this.page.param)
        this.initView();
        this.setView();
        this.initUtil();
    }

    initView(){
        this.small_video = this.findViewById("small_video");
        if(!this.page.focusView){//page启动，初始焦点不在page，在当前fragment
            this.small_video.requestFocus();
        }

        this.small_view_pic = this.findViewById("small_view_pic");

    }

    setView(){}

    initUtil(){}

    onClickListener(view){
        console.log("onClickListener",view)
        this.startPage("ListPage",{data:"ListPage的数据"})
    }

}
