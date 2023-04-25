import Fragment from "@core/frame/view/group/Fragment";

import html from "../html/fragment/fragment_0.html"

export default class Fragment_0 extends Fragment{
    onCreate() {
        console.log("Fragment_0","-onCreate");
        this.html = html;
    }


    onResume() {
        console.log("Fragment_0","-onResume");
    }

    onPause() {
        console.log("Fragment_0","-onPause");
    }

    onStop() {
        // console.log("Fragment_0","-onStop");
    }

    onDestroy() {
        // console.log("Fragment_0","-onDestroy");
    }
}
