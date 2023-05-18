import Page from "../../core/frame/page/Page";
import View from "../../core/frame/view/base/View";
import {Adapter} from "@core/frame/view/group/RecycleView";
import ContentAdapter from "@src/adapter/ContentAdapter";
import Toast from "@core/frame/view/single/Toast";


export default class ListPage extends Page {
    onCreate(param) {
        console.log(this.pageName, "onCreate", "传入参数", param);
        this.html = require("../html/list.html");

        this.content_list = this.findViewById("content_list");
        this.content_list.col = 4;
        this.content_list.margin.right = 5;
        this.content_list.adapter = new ContentAdapter();
        this.content_list.data = contentListData;

        this.toast = new Toast(this);
    }

    onClickListener(view) {
        console.log(this.pageName + "-key_ok_event");
        this.toast.show("点击跳转");
        // var testPage = new TestPage();
        // this.startPage(testPage, {data: "tttttt"});


        var that = this;
        setTimeout(function (){
            that.startPage("FramePage", {data: "framePage的初始参数"});
            that.finish();
        },500);
    }

    setResult(data) {
        console.log("setResult", data);
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
        this.setResult({data: "来自ListPage的数据"});
        this.finish();
    }
}

var contentListData = [
    {name: "密室大逃脱 第四季", info: "杨幂 大张伟 黄明昊 张国伟"},
    {name: "乘风破浪 第三季", info: "那英 宁静 张蔷 许茹芸 黄奕 柳翰雅 胡杏儿 钟欣潼"},
    {name: "向往的生活 第六季", info: "黄磊 何炅 张艺兴 彭昱畅 张子枫"},
    {name: "你好，星期六", info: "何炅 冯禧"},
    {name: "披荆斩棘 第二季", info: "杜德伟 温兆伦 任贤齐 陈小春"},
    {name: "快乐再出发", info: "陈楚生 苏醒 王栎鑫 张远 陆虎"},
    {name: "中餐厅 第六季", info: "黄晓明 殷桃 尹正 章若楠 陈立农"},
    {name: "花儿与少年 第四季", info: "张凯丽 刘敏涛 杨幂"},
    {name: "密室大逃脱 4 大神版", info: "未知"},
    {name: "爸爸当家", info: "李艾 魏晨 王祖蓝 李亚男"},
    {name: "向往的生活 6 会员Plus版", info: "黄磊 何炅 张艺兴 彭昱畅 张子枫"},
    {name: "100道光芒", info: "未知"},
    {name: "快乐再出发 加更版", info: "陈楚生 苏醒 王栎鑫 张远 陆虎"},
    {name: "美好年华研习社", info: "汪涵 马可"},
    {name: "大侦探 第七季", info: "何炅 张若昀 大张伟 王欧 魏晨"},
    {name: "乘风破浪3 舞台纯享版", info: "那英 宁静 张蔷 许茹芸 黄奕 柳翰雅 胡杏儿 钟欣潼"}
]
