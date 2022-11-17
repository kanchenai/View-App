import View from "@core/frame/view/base/View";

export default class ImageView extends View {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);
        delete this.childViews;
        //是否已加载
        this.isLoaded = false;
        //加载图片的timer，用于节省isShowing和isDisplayRange属性获取的时间
        this.timer = null;
        //是否立刻加载
        this.lazy = true;
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

    loadImageImmediate() {
        if (this.isLoaded) {
            return;
        }
        // if (this.src) {
        //     console.log("ImageView", "图片载入", this.src);
        // }
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
        this.ele.src = "";
        this.isLoaded = false;
        if(!this.lazy){
            this.loadImageImmediate();
        }else{
            this.loadImageResource();
        }
    }

    get src() {
        return this._data;
    }


    /**
     * 将标签中的属性解析到对应的变量中
     */
    setAttributeParam() {
        var lazy = View.parseAttribute("view-lazy",this.ele);

        if (lazy == "false" || lazy == "0") {
            this.lazy = false;
        }

        var src = this.ele.src;//将图片地址赋值给src
        if (this.ele.hasAttribute("src")) {
            this.ele.removeAttribute("src");//置空，避免直接加载
        }
        this.src = src;
        return super.setAttributeParam();
    }

    /**
     * 使用ele创建控件
     * @param{Element} ele
     * @param{ViewManager} viewManager
     * @param{View} listenerLocation
     * @returns {ImageView}
     */
    static parseByEle(ele, viewManager, listenerLocation) {
        var imageView = new ImageView(viewManager, listenerLocation);
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
                view.image = ImageView.parseByEle(child_ele, view.viewManager, view.listenerLocation);
            } else {
                if (!viewType || viewType == "DIV") {//只有当viewType为DIV时往内部寻找，其他的忽略
                    ImageView.bindImageByEle(child_ele, view);
                }
            }
        }
    }
};

