import Fragment from "../../core/frame/view/group/Fragment";

import html from "../html/fragment/fragment_1.html"

export default class Fragment_1 extends Fragment{
    onCreate() {
        console.log("Fragment_1","-onCreate");
        this.html = html;
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