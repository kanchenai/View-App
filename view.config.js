import HomePage from "@page/HomePage";
import ListPage from "@page/ListPage";
import FramePage from "@page/FramePage";
import TestPage from "@page/TestPage";
import PlayerPage from "@page/PlayerPage";
import ButtonPage from "@page/ButtonPage";
import WaterFallPage from "@page/WaterFallPage";
import PosterPage from "@page/PosterPage";
import ItemPage from "@page/ItemPage";
import GroupPage from "@page/GroupPage";
import RecyclePage from "@page/RecyclePage";
import DialogPage from "@page/DialogPage";
import ImagePage from "@page/ImagePage";
import LogPage from "@page/LogPage";
import TextPage from "@page/TextPage";
import ToastPage from "@page/ToastPage";

/**
 * 定义在App中需要使用到的Page，并给Page设置对应的PageName
 * 舍去0.4之前版本中需要在Page子类中赋值pageName步骤
 */
export var PageConfig = {
    "HomePage": HomePage,
    "ItemPage": ItemPage,
    "GroupPage": GroupPage,
    "FramePage": FramePage,
    "RecyclePage": RecyclePage,
    "DialogPage": DialogPage,
    "ImagePage": ImagePage,
    "LogPage": LogPage,
    "PlayerPage": PlayerPage,
    "TextPage": TextPage,
    "ToastPage": ToastPage,
    "WaterFallPage": WaterFallPage,
    "ButtonPage": ButtonPage,
    "PosterPage": PosterPage,

    "ListPage": ListPage,
    "TestPage": TestPage,
}

/**
 * 默认的page
 * 当未获取到第一个页面时，会使用该页面
 * 这个值必须是PageConfig中的其中一个
 * @type {string}
 */
export var LaunchPage = "HomePage";
