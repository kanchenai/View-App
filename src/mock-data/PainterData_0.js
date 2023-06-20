class BaseData {
    constructor(id, type, props, style, data, children) {
        this.id = id;
        this.type = type;
        this.props = props;
        this.style = style;
        this.data = data;
        this.children = children;
    }
}

class Div extends BaseData {
    constructor(id, width, height, left, top, style, children) {
        if (style) {
            style = JSON.parse(JSON.stringify(style));
        }
        if (width) {
            style.width = width + "px";
        }

        if (height) {
            style.height = height + "px";
        }

        if (left) {
            style.left = left + "px";
        }

        if (top) {
            style.top = top + "px";
        }

        super(id, "", null, style, null, children);
    }

}

class Img extends BaseData {
    constructor(id, src, width, height, left, top) {
        var props = {
            src: src
        };
        var style = {
            width: width + "px",
            height: height + "px"
        }
        if (left) {
            style.left = left + "px";
        }

        if (top) {
            style.top = top + "px";
        }

        super(id, "img", props, style, null, null);
    }
}

class Poster extends BaseData {
    constructor(width, height, left, top, data, children) {
        var props = {
            size: width + "," + height
        };
        var style = {}
        if (left) {
            style.left = left + "px";
        }

        if (top) {
            style.top = top + "px";
        }
        super("", "poster", props, style, data, children);
    }
}

class Group extends BaseData {
    constructor(width, height, left, top, data, children) {
        var style = {
            width: width + "px",
            height: height + "px"
        }
        if (left) {
            style.left = left + "px";
        }

        if (top) {
            style.top = top + "px";
        }
        super("", "group", null, style, data, children);
    }
}

class Button extends BaseData {
    constructor(props, width, height, left, top, children) {
        var style = {
            width: width + "px",
            height: height + "px"
        }
        if (left) {
            style.left = left + "px";
        }

        if (top) {
            style.top = top + "px";
        }
        super("", "button", props, style, null, children);
    }
}

var groupList = [];

//背景

var bg = new Img("", require("../images/bg.jpg"), 1280, 720)

groupList.push(bg);

//顶部按钮
var top_group = new Group(1280, 120, 0, 0, null)

var src = require("../images/focus/120x60.png")
var buttonFocus = new Img("focus", src, 158, 98);

top_group.children = [
    new Button({value: "收藏"}, 120, 60, 45, 30, [buttonFocus]),
    new Button({value: "搜索"}, 120, 60, 970, 30, [buttonFocus]),
    new Button({value: "订购"}, 120, 60, 1115, 30, [buttonFocus]),
]

groupList.push(top_group);

var lineStyle = {
    background: "gray",
}
var line = new Div("", 1280, 1, 0, 120, lineStyle, null, null)

groupList.push(line);

var firstGroup = {
    type: "group",
    style: {
        width: "1280px",
        height: "570px",
        top: "120px",
    },
    children: []
}

var firstGroup = new Group(1280, 570, 0, 120, null)

var posterData = {
    poster: require("../images/poster.png")
}

var focus_560x232 = new Img("focus", require("../images/focus/560x232.png"), 598, 280);
var focus_176x232 = new Img("focus", require("../images/focus/176x232.png"), 214, 280);

firstGroup.children = [
    new Poster(560, 232, 72, 19, posterData, [
        focus_560x232
    ]),
    new Poster(176, 232, 647, 19, posterData, [
        focus_176x232
    ]),
    new Poster(176, 232, 838, 19, posterData, [
        focus_176x232
    ]),
    new Poster(176, 232, 1029, 19, posterData, [
        focus_176x232
    ]),
    new Poster(176, 232, 72, 277, posterData, [
        focus_176x232
    ]),
    new Poster(176, 232, 264, 277, posterData, [
        focus_176x232
    ]),
    new Poster(176, 232, 456, 277, posterData, [
        focus_176x232
    ]),
    new Poster(560, 232, 647, 277, posterData, [
        focus_560x232
    ]),
]

groupList.push(firstGroup);


export default groupList;