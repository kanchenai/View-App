import Fragment from "@core/frame/view/group/Fragment";


export default class Fragment_0 extends Fragment{
    onCreate() {
        console.log("Fragment_0","-onCreate");
        this.html = require("@html/fragment/frame/fragment_0");

        this.setStyle("background","red");
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
