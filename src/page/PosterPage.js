import Page from "@core/frame/page/Page";
import pic from "../images/poster.png";

export default class PosterPage extends Page {
    onCreate(param) {
        this.html = require("../html/poster.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.poster_white = this.findViewById("poster_white");
        this.poster = this.findViewById("poster");
    }

    setView() {
    }

    initUtil() {
        var pic = require("../images/poster.png")
        this.poster_white.data = [
            {poster: pic, name: "medium - 216,280"},
            {poster: pic, name: "small - 176,232"},
            {poster: pic, name: "mini - 136,176"},
            {poster: pic, name: "指定size - 200,300"},
            {poster: pic, name: "定制焦点"}
        ]

        this.poster.data = [
            {poster: pic},
            {poster: pic},
            {poster: pic},
            {poster: pic},
            {poster: pic}
        ]

    }
}
