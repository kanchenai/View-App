import HomePage from "@page/HomePage";
import ListPage from "@page/ListPage";
import FramePage from "@page/FramePage";
import TestPage from "@page/TestPage";
import PlayerPage from "@page/PlayerPage";
import ButtonPage from "@page/ButtonPage";

/**
 * 定义在App中需要使用到的Page，并给Page设置对应的PageName
 * 舍去0.4之前版本中需要在Page子类中赋值pageName步骤
 */
export var PageConfig = {
    "HomePage": HomePage,
    "ListPage": ListPage,
    "FramePage": FramePage,
    "TestPage": TestPage,
    "PlayerPage": PlayerPage,
    "ButtonPage":ButtonPage
}

/**
 * 默认的page
 * 当未获取到第一个页面时，会使用该页面
 * 这个值必须是PageConfig中的其中一个
 * @type {string}
 */
export var LaunchPage = "HomePage";
