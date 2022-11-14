import Page from "../page/Page";

var keyboard = null;

var isOnkeydown = false;
var isOnkeypress = false;
var lastTime = 0;

export default class Keyboard {
    static KEY_CODE;
    constructor() {
        if (keyboard) {
            return keyboard;
        }
        keyboard = this;
        this.interval = 150;
        /**
         *
         * @type {Page}
         */
        this.page = null;

        window.document.onkeydown = this.onkeydownKeyEvent;
        window.document.onkeypress = this.onkeypressKeyEvent;
    }

    /**
     * @function onkeypressKeyEvent
     * @param {object} event 按键事件
     * @description 按键按下松开处理
     */
    onkeypressKeyEvent(event) {
        //如果执行了onkeypress则不再执行onkeydown
        if (isOnkeydown) {
            isOnkeydown = false; //用过一次后，需要还原
            return;
        }
        if (!isOnkeypress) {
            isOnkeypress = true;
        }
        var keyCode = event.which ? event.which : event.keyCode;
        var dispatch = keyboard.keyHandle(keyCode);

        if (keyCode == 340) //禁止华数ipanel盒子自动返回
            return 0;  //兼容ipannel 返回
        return dispatch;
    }

    /**
     * @function onkeydownKeyEvent
     * @param {object} event 按键事件
     * @description 按键按下处理
     */
    onkeydownKeyEvent(event) {
        //如果执行了onkeypress则不再执行onkeydown
        if (isOnkeypress) {
            isOnkeypress = false; //用过一次后，需要还原，防止烽火盒子确定键只发一个
            return;
        }
        if (!isOnkeydown) {
            isOnkeydown = true;
        }
        var keyCode = event.which ? event.which : event.keyCode;
        var dispatch = keyboard.keyHandle(keyCode);

        //禁止华数ipanel盒子自动返回,上，下，左,右,自动返回执行
        if (keyCode === 1 || keyCode === 2 || keyCode === 3
            || keyCode === 4 || keyCode === 340 || keyCode === 37
            || keyCode === 38 || keyCode === 39 || keyCode === 40) {
            return 0;//兼容ipannel 返回
        }
        return dispatch;
    }

    keyHandle(keyCode) {
        if (!this.page) {
            return false;
        }

        var now = new Date().getTime();
        if (now - lastTime < this.interval) {//小于间隔时间
            return;
        }
        lastTime = now;
        Keyboard.KEY_CODE = keyCode;
        switch (keyCode) {
            case Keyboard.KEY_0:
            case Keyboard.KEY_1:
            case Keyboard.KEY_2:
            case Keyboard.KEY_3:
            case Keyboard.KEY_4:
            case Keyboard.KEY_5:
            case Keyboard.KEY_6:
            case Keyboard.KEY_7:
            case Keyboard.KEY_8:
            case Keyboard.KEY_9:
                this.page.key_number_event(keyCode - 48);
                break;
            case Keyboard.KEY_UP_IPANEL:  //ipannel
            case Keyboard.KEY_UP:
                this.page.key_up_event();
                break;
            case Keyboard.KEY_DOWN_IPANEL:  //ipannel
            case Keyboard.KEY_DOWN:
                this.page.key_down_event();
                break;
            case Keyboard.KEY_LEFT_IPANEL:  //ipannel
            case Keyboard.KEY_LEFT:
                this.page.key_left_event();
                break;
            case Keyboard.KEY_RIGHT_IPANEL:  //ipannel
            case Keyboard.KEY_RIGHT:
                this.page.key_right_event();
                break;
            case Keyboard.KEY_OK:
                this.page.key_ok_event();
                break;
            case Keyboard.KEY_SPACE: //空格键
            case Keyboard.KEY_BACK_CLOUD: //兼容云平台
            case Keyboard.KEY_BACK_IPANEL: //ipannel 返回
            case Keyboard.KEY_BACK_FENGHUO: //兼容烽火盒子
            case Keyboard.KEY_BACK:
                this.page.key_back_event();
                break;
            case Keyboard.KEY_PAGEUP:
                this.page.key_pageUp_event();
                break;
            case Keyboard.KEY_PAGEDOWN:
                this.page.key_pageDown_event();
                break;
            case Keyboard.KEY_DEL:
                this.page.key_del_event();
                break;
            case Keyboard.KEY_VOLUP:
            case 81://...
                this.page.key_volUp_event();
                break;
            case Keyboard.KEY_VOLDOWN:
            case 87://...
                this.page.key_volDown_event();
                break;
            case Keyboard.KEY_MUTE:
            case 69://...
                this.page.key_mute_event();
                break;
            case Keyboard.KEY_RED:
            case Keyboard.KEY_RED_EC: //兼容华为EC6108V9A悦盒
                this.page.key_red_event();
                break;
            case Keyboard.KEY_GREEN:
            case Keyboard.KEY_GREEN_EC: //兼容华为EC6108V9A悦盒
                this.page.key_green_event();
                break;
            case Keyboard.KEY_YELLOW:
            case Keyboard.KEY_YELLOW_EC: //兼容华为EC6108V9A悦盒
                this.page.key_yellow_event();
                break;
            case Keyboard.KEY_BLUE:
            case Keyboard.KEY_BLUE_EC: //兼容华为EC6108V9A悦盒
                this.page.key_blue_event();
                break;
            case Keyboard.KEY_MPEVENT:
                //播放事件处理
                eval("eventJson=" + Utility.getEvent());
                this.page.key_player_event(eventJson);
                break;
            default:
                var dispatch = this.page.key_default_event(keyCode);
                if (typeof (dispatch) == "undefined") {
                    dispatch = true;
                }
                return dispatch;
                break;

        }

        Keyboard.KEY_CODE = -1;
        return false;
    }
}

//返回键
Keyboard.KEY_BACK = 8;
Keyboard.KEY_SPACE = 32;//电脑空格键，用作浏览器返回
Keyboard.KEY_BACK_CLOUD = 45;//云平台返回
Keyboard.KEY_BACK_FENGHUO = 1249;//烽火盒子返回

Keyboard.KEY_OK = 13;//确定键

Keyboard.KEY_LEFT = 37; //左键
Keyboard.KEY_UP = 38; //上键
Keyboard.KEY_RIGHT = 39; //右键
Keyboard.KEY_DOWN = 40; //下键

//ipanel 特殊键值
Keyboard.KEY_BACK_IPANEL = 340;//ipanel 返回
Keyboard.KEY_LEFT_IPANEL = 3; //ipanel 左键
Keyboard.KEY_UP_IPANEL = 1; //ipanel 上键
Keyboard.KEY_RIGHT_IPANEL = 4; //ipanel 右键
Keyboard.KEY_DOWN_IPANEL = 2; //ipanel 下键


Keyboard.KEY_PAGEUP = 33;//上翻页键
Keyboard.KEY_PAGEDOWN = 34; //下翻页键

//数字键 0~9
Keyboard.KEY_0 = 48;
Keyboard.KEY_1 = 49;
Keyboard.KEY_2 = 50;
Keyboard.KEY_3 = 51;
Keyboard.KEY_4 = 52;
Keyboard.KEY_5 = 53;
Keyboard.KEY_6 = 54;
Keyboard.KEY_7 = 55;
Keyboard.KEY_8 = 56;
Keyboard.KEY_9 = 57;

Keyboard.KEY_VOLUP = 259; //音量加
Keyboard.KEY_VOLDOWN = 260; //音量减
Keyboard.KEY_MUTE = 261; //静音键
Keyboard.KEY_DEL = 46;//海信 删除键

// 四色键
Keyboard.KEY_RED = 275;
Keyboard.KEY_GREEN = 276;
Keyboard.KEY_YELLOW = 277;
Keyboard.KEY_BLUE = 278;

//兼容华为EC6108V9A悦盒
Keyboard.KEY_RED_EC = 1108;
Keyboard.KEY_GREEN_EC = 1110;
Keyboard.KEY_YELLOW_EC = 1109;
Keyboard.KEY_BLUE_EC = 1112;

Keyboard.KEY_MPEVENT = 768;//播放事件键值
