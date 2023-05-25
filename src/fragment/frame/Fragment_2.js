import Fragment from "@core/frame/view/group/Fragment";

export default class Fragment_2 extends Fragment{
    onCreate() {
        console.log("Fragment_2","-onCreate");
        this.html = require("@html/fragment/frame/fragment_2");

        this.setStyle("background","blue");
    }

    onResume() {
        console.log("Fragment_2","-onResume");
    }

    onPause() {
        console.log("Fragment_2","-onPause");
    }

    onStop() {
        // console.log("Fragment_2","-onStop");
    }

    onDestroy() {
        // console.log("Fragment_2","-onDestroy");
    }
}
