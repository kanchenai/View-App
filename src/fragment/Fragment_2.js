import Fragment from "../../core/frame/view/group/Fragment";

import html from "../html/fragment/fragment_2.html"

export default class Fragment_2 extends Fragment{
    onCreate() {
        console.log("Fragment_2","-onCreate");
        this.html = html;
    }

    onResume() {
        console.log("Fragment_2","-onResume");
    }

    onPause() {
        console.log("Fragment_2","-onPause");
    }

    onStop() {
        console.log("Fragment_2","-onStop");
    }

    onDestroy() {
        console.log("Fragment_2","-onDestroy");
    }
}