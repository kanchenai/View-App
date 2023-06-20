import View from "@core/frame/view/base/View";

export default class PainterUtil {
    constructor(painterView) {
        this.painterView = painterView;
        if (painterView.id) {
            this.idPrefix = painterView.id;
        } else {
            this.idPrefix = "painter";
        }

        this.children = [];//PainterChild列表
        this.dataObject = {};
    }

    /**
     * @param{Array} value
     */
    set data(value) {
        for (var i = 0; i < value.length; i++) {
            var child = value[i];
            child.id = this.idPrefix + "_" + i;
            if (child.data) {
                this.dataObject[child.id] = child.data;
            }
            var painterChild =
                new PainterChild(this, child);
            this.children.push(painterChild);
        }
    }

    bindData() {
        var idList = Object.keys(this.dataObject);
        for (var i = 0; i < idList.length; i++) {
            var view = this.painterView.findViewById(idList[i]);
            if (view) {
                view.data = this.dataObject[idList[i]];
            }
        }
    }

    get html() {
        var list = [];
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            list.push(View.eleToStr(child.build()))
        }

        return list.join("\n");
    }
}

export class PainterChild {
    constructor(util, data) {
        this.util = util;
        this.data = data;
    }

    build() {
        var children = [];
        if (this.data.children && this.data.children.length > 0) {
            for (var i = 0; i < this.data.children.length; i++) {
                var child = this.data.children[i];
                if (!child.id) {
                    child.id = this.data.id + "_" + i;
                }

                if (child.data) {
                    this.util.dataObject[child.id] = child.data;
                }

                var painterChild =
                    new PainterChild(this.util, child);
                children.push(painterChild);
            }
        }

        var tagName = "div";
        if (this.data.type == "img" || this.data.type == "IMG") {
            tagName = "img";
        }
        var ele = document.createElement(tagName);

        if (this.data.id) {
            ele.setAttribute("view-id", this.data.id);
        }

        var viewType = "";
        if (this.data.type && (this.data.type != "div" && this.data.type != "DIV") && (this.data.type != "img" && this.data.type != "IMG")) {
            viewType = this.data.type;
        }
        if (viewType) {
            ele.setAttribute("view-type", viewType);
        }

        if (this.data.props) {
            var keys = Object.keys(this.data.props);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = this.data.props[key];
                if (value) {
                    if (key == "src") {
                        ele.src = value;
                    } else if (viewType == "text" || viewType == "view-text" || !viewType) {
                        if (key == "value") {
                            ele.innerText = value;
                        }
                    } else {
                        ele.setAttribute(key, value);
                    }
                }
            }
        }

        if (this.data.style) {
            var styleKeys = Object.keys(this.data.style);
            for (var i = 0; i < styleKeys.length; i++) {
                var key = styleKeys[i];
                var value = this.data.style[key];
                if (value) {
                    ele.style[key] = value;
                }
            }
        }

        if (children.length > 0) {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                ele.append(child.build());
            }
        }

        return ele;
    }
}