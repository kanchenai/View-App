import {ScrollAnimation} from "../view/base/ScrollView";

/**
 * app内状态枚举
 */
var State = {
    /**
     * 生命周期状态枚举
     * Page、Fragment
     */
    LifeState:{
        //未创建
        BEFORE_CREATE:"BEFORE_CREATE",
        //创建
        CREATE:"CREATE",
        //运行
        RUN:"RUN",
        //暂停
        PAUSE:"PAUSE",
        //停止
        STOP:"STOP",
        //销毁
        DESTROY:"DESTROY"
    },
    /**
     * app启动状态枚举
     */
    LaunchMode:{
        //启动APP
        ENTER: "ENTER",
        //返回APP
        BACK: "BACK"
    },

    /**
     * 页面模式
     */
    PageMode:{
        SINGLE:"SINGLE",
        MULTIPLE:"MULTIPLE"
    },

    ScrollAnimation:true,

    Orientation:{
        vertical:0,
        horizontal:1
    }
}

export default State;
