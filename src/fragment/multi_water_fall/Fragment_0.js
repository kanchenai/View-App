import Fragment from "@core/frame/view/group/Fragment";
import pic from "@images/poster.png";

export default class Fragment_0 extends Fragment{
    onCreate() {
        this.html = require("../../html/fragment/multi_water_fall/fragment_0.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.poster_list = this.findViewById("poster_list");
    }

    setView() {
    }

    initUtil() {
        var pic = require("../../images/poster.png")
        this.poster_list.data = [
            {poster: pic,name:"显示一个内容标题1"},
            {poster: pic,name:"显示一个内容标题2"},
            {poster: pic,name:"显示一个内容标题3"},
            {poster: pic,name:"显示一个内容标题4"},
            {poster: pic,name:"显示一个内容标题5"},
            {poster: pic,name:"显示一个内容标题6"},
            {poster: pic,name:"显示一个内容标题7"},
            {poster: pic,name:"显示一个内容标题8"},
            {poster: pic,name:"显示一个内容标题9"}
        ]
    }

    onClickListener(view) {
        switch (view.id){
            case "back_top":
                this.findViewById("first_button").requestFocus();
                break;
        }
    }
}