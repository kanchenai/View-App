import View from "@core/frame/view/base/View";

export default class ImageView extends View {
    constructor(viewManager) {
        super(viewManager);
        delete this.childViews;
        //是否已加载
        this.isLoaded = false;
        //加载图片的timer，用于节省isShowing和isDisplayRange属性获取的时间
        this.timer = null;
    }

    loadImageResource() {
        if (this.isLoaded) {
            return;
        }
        if (!this.src) {//没有图片
            return;
        }

        if (this.timer) {
            clearTimeout(this.timer);
        }
        var that = this;
        this.timer = setTimeout(function () {
            if (that.isShowing && that.isDisplayRange) {
                that.loadImageImmediate();
            }
        }, 10);
    }

    loadImageImmediate(){
        if(this.src){
            console.log("ImageView", "图片载入", this.src);
        }
        this.ele.src = this.src;
        this.isLoaded = true;
    }

    /**
     * 显示
     */
    show() {
        this.ele.style.visibility = "";
        this.ele.style.display = "block";
        this.loadImageResource();//加载图片
        this.callVisibleChangeListener(this, true);
    }

    /**
     * 隐藏view
     */
    hide() {
        this.ele.style.visibility = "";
        this.ele.style.display = "none";
        this.callVisibleChangeListener(this, false);
    }

    set left(value) {
        super.left = value;
        this.loadImageResource();
    }

    set top(value) {
        super.top = value;
        this.loadImageResource();
    }

    set width(value) {
        super.width = value;
        this.loadImageResource();
    }

    set height(value) {
        super.height = value;
        this.loadImageResource();
    }

    /**
     * 绑定数据
     */
    set src(value) {
        if (this._data == value) {
            return;
        }

        this._data = value;
        if (this.isShowing && this.isDisplayRange) {//在需要显示
            this.loadImageImmediate();
        }else{
            this.isLoaded = false;
            this.ele.src = "";//置空
            this.loadImageResource();//加载图片
        }
    }

    get src() {
        return this._data;
    }


    /**
     * 将标签中的属性解析到对应的变量中
     */
    setAttributeParam() {
        this.src = this.ele.src;//将图片地址赋值给src
        this.ele.src = "";
        if (this.ele.hasAttribute("src")) {
            this.ele.removeAttribute("src");//置空，避免直接加载
        }

        return super.setAttributeParam();
    }

    /**
     * 使用ele创建控件
     * @param{Element} ele
     * @param{ViewManager} viewManager
     * @returns {ImageView}
     */
    static parseByEle(ele, viewManager) {
        var imageView = new ImageView(viewManager);
        imageView.ele = ele;
        imageView.setAttributeParam();
        return imageView;
    }

    /**
     * 给view绑定ImageView
     * ItemView和GroupView、以及这两个控件的子类控件可以绑定图片
     * View和ScrollView不在此列，需要父控件穿透绑定
     * @param ele 图片节点
     * @param view 图片绑定的控件
     */
    static bindImageByEle(ele, view) {
        var ele_list = ele.children;
        if (ele_list.length == 0) {
            return [];
        }
        for (var child_ele of ele_list) {
            var viewType = child_ele.tagName;
            if (viewType == "DIV") {
                viewType = child_ele.getAttribute("view-type");
                if (viewType) {
                    viewType = viewType.toUpperCase();
                }
            }

            if (viewType == "IMG") {
                view.image = ImageView.parseByEle(child_ele, view.viewManager);
            } else {
                if (!viewType
                    || viewType == "DIV"
                    || (viewType != "VIEW"
                        && viewType.indexOf("SCROLL") < 0)) {
                    ImageView.bindImageByEle(child_ele, view);
                }
            }
        }
    }
};

