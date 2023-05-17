import Fragment from "../../core/frame/view/group/Fragment";

export default class Fragment_1 extends Fragment{
    onCreate() {
        console.log("Fragment_1","-onCreate");
        this.html = require("../html/fragment/fragment_1.html");

        this.setStyle("background","green");
    }

    onResume() {
        // console.log("Fragment_1","-onResume");
    }

    onPause() {
        // console.log("Fragment_1","-onPause");
    }

    onStop() {
        // console.log("Fragment_1","-onStop");
    }

    onDestroy() {
        // console.log("Fragment_1","-onDestroy");
    }
}
