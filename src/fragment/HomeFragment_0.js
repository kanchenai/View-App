import Fragment from "../../core/frame/view/group/Fragment";

import html from "../html/fragment/home_fragment_0.html"

export default class HomeFragment_0 extends Fragment{
    onCreate() {
        var start = new Date().getTime();
        this.html = html;
        console.log(new Date().getTime() - start)
    }

    onResume() {
    }

    onPause() {
    }

    onStop() {
    }

    onDestroy() {
    }
}