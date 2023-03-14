/**
 * 在一张完整的图片(或背景div)中，镂空出一个视频窗
 * bgEle图片需要占满整个bgParentNode背景
 * 必须和videoBgToBg成对使用
 * @param{Element} bgParentNode img的父节点
 * @param{Element} bgEle img
 * @param{PlayInfo} playInfo 播放信息
 */
var bgToVideoBg = function (bgParentNode, bgEle, playInfo) {
    var type = "pic";
    var src = "";
    var background = ""
    if (bgEle.tagName == "IMG") {
        src = bgEle.src;
    }else{
        type = "color";
        background = getComputedStyle(bgEle).background;
    }

    console.log("bgToVideoBg",type);

    var bgParentRect = bgParentNode.getBoundingClientRect();

    var bgRect = bgEle.getBoundingClientRect();

    //上
    var divTop = document.createElement("div");

    divTop.style.width = bgRect.width + "px";
    divTop.style.height = playInfo.top - bgParentRect.top + "px";
    divTop.style.overflow = "hidden";
    if(type == "pic"){
        var imgTop = document.createElement("img");
        imgTop.src = src;
        divTop.appendChild(imgTop)
    }else{
        divTop.style.background = background;
    }

    //下
    var divBottom = document.createElement("div");
    divBottom.style.width = bgRect.width + "px";
    divBottom.style.height = bgRect.height - playInfo.height - playInfo.top + bgParentRect.top + "px";
    divBottom.style.top = playInfo.top + playInfo.height - bgParentRect.top + "px";
    divBottom.style.overflow = "hidden";
    if(type == "pic"){
        var imgBottom = document.createElement("img");
        imgBottom.style.top = - playInfo.height - playInfo.top + "px";
        imgBottom.src = src;
        divBottom.appendChild(imgBottom)
    }else{
        divBottom.style.background = background;
    }

    //左
    var divLeft = document.createElement("div");
    divLeft.style.width = playInfo.left - bgParentRect.left + "px";
    divLeft.style.height = playInfo.height + "px";
    divLeft.style.top = playInfo.top - bgParentRect.top + "px";
    divLeft.style.overflow = "hidden";

    if(type == "pic"){
        var imgLeft = document.createElement("img");
        imgLeft.style.top = -(playInfo.top - bgParentRect.top) + "px";
        imgLeft.src = src;
        divLeft.appendChild(imgLeft)
    }else{
        divLeft.style.background = background;
    }

    //右
    var divRight = document.createElement("div");
    divRight.style.width = bgRect.width - (playInfo.left - bgParentRect.left + playInfo.width) + "px";
    divRight.style.height = playInfo.height + "px";
    divRight.style.left = playInfo.left - bgParentRect.left + playInfo.width + "px";
    divRight.style.top = playInfo.top - bgParentRect.top + "px";
    divRight.style.overflow = "hidden";
    if(type == "pic"){
        var imgRight = document.createElement("img");
        imgRight.style.top = -(playInfo.top - bgParentRect.top) + "px";
        imgRight.style.left = -(playInfo.left + playInfo.width) + "px";
        imgRight.src = src;
        divRight.appendChild(imgRight)
    }else{
        divRight.style.background = background;
    }

    bgParentNode.appendChild(divTop)
    bgParentNode.appendChild(divBottom)
    bgParentNode.appendChild(divLeft)
    bgParentNode.appendChild(divRight)

    bgEle.style.display = "none";
}

/**
 * 将bgToVideoBg转成初始图片状态
 * 必须和bgToVideoBg成对使用
 * @param bgParentNode
 * @param bgEle
 */
var videoBgToBg = function (bgParentNode, bgEle){
    for(var i = 0;i<bgParentNode.children.length;i++){
        if(bgParentNode.children[i] != bgEle){
            bgParentNode.children[i].remove();//将当前节点从application中移除
            //兼容ele.remove无效
            if (bgParentNode.contains(bgParentNode.children[i])) {
                bgParentNode.removeChild(bgParentNode.children[i]);
            }
        }
    }

    bgEle.style.display = "";
}

export default {
    bgToVideoBg,
    videoBgToBg
}
