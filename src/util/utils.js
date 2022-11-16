/**
 * 在一张完整的图片中，镂空出一个视频窗
 * 图片需要占满整个背景
 * 必须和videoBgToBg成对使用
 * @param{Element} bgParentNode img的父节点
 * @param{Element} bgEle img
 * @param{PlayInfo} playInfo 播放信息
 */
var bgToVideoBg = function (bgParentNode, bgEle, playInfo) {
    if (bgEle.tagName != "IMG") {
        console.warn("bgEle必须是img");
        return;
    }
    var bgRect = bgEle.getBoundingClientRect();

    //上
    var divTop = document.createElement("div");
    divTop.style.width = bgRect.width + "px";
    divTop.style.height = playInfo.top + "px";
    divTop.style.overflow = "hidden";
    var imgTop = document.createElement("img");
    imgTop.src = bgEle.src;
    divTop.appendChild(imgTop)

    //下
    var divBottom = document.createElement("div");
    divBottom.style.width = bgRect.width + "px";
    divBottom.style.height = bgRect.height - (playInfo.top + playInfo.height) + "px";
    divBottom.style.top = playInfo.top + playInfo.height + "px";
    divBottom.style.overflow = "hidden";
    var imgBottom = document.createElement("img");
    imgBottom.style.top = -(playInfo.top + playInfo.height) + "px";
    imgBottom.src = bgEle.src;
    divBottom.appendChild(imgBottom)

    //左
    var divLeft = document.createElement("div");
    divLeft.style.width = playInfo.left + "px";
    divLeft.style.height = playInfo.height + "px";
    divLeft.style.top = playInfo.top + "px";
    divLeft.style.overflow = "hidden";
    var imgLeft = document.createElement("img");
    imgLeft.style.top = -playInfo.top + "px";
    imgLeft.src = bgEle.src;
    divLeft.appendChild(imgLeft)

    //右
    var divRight = document.createElement("div");
    divRight.style.width = bgRect.width - (playInfo.left + playInfo.width) + "px";
    divRight.style.height = playInfo.height + "px";
    divRight.style.left = playInfo.left + playInfo.width + "px";
    divRight.style.top = playInfo.top + "px";
    divRight.style.overflow = "hidden";
    var imgRight = document.createElement("img");
    imgRight.style.top = -playInfo.top + "px";
    imgRight.style.left = -(playInfo.left + playInfo.width) + "px";
    imgRight.src = bgEle.src;
    divRight.appendChild(imgRight)


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
