import HomePage from "@page/HomePage";
import ListPage from "@page/ListPage";
import FramePage from "@page/FramePage";
import TestPage from "@page/TestPage";
import PlayerPage from "@page/PlayerPage";

/**
 * 定义PageName对应的Page，舍去在Page子类中赋值pageName步骤
 */
export var PageConfig = {
    "HomePage": HomePage,
    "ListPage": ListPage,
    "FramePage": FramePage,
    "TestPage": TestPage,
    "PlayerPage": PlayerPage
}

/**
 * 默认的page
 * 当未获取到第一个页面时，会使用改页面
 * @type {string}
 */
export var LaunchPage = "HomePage";
