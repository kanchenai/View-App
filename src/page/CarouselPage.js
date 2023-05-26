import Page from "@core/frame/page/Page";

export default class CarouselPage extends Page {
    onCreate(param) {
        this.html = require("../html/carousel.html")

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.carousel = this.findViewById("carousel");
        this.carousel_custom_size = this.findViewById("carousel_custom_size");
        this.carousel_custom_poster = this.findViewById("carousel_custom_poster");
    }

    setView() {
    }

    initUtil() {
        var data = [];
        for (var i = 0; i < 12; i++) {
            data.push({
                poster: require("../images/poster.png"),
                name: "第" + (i + 1) + "个海报"
            })
        }
        this.carousel.data = data;
        this.carousel_custom_size.data = data;
        this.carousel_custom_poster.data = data;
    }
}
