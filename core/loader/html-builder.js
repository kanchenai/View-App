/**
 * 将html加上标签属性，区分样式渲染
 * @param original_html
 * @returns {string}
 */
module.exports = function (original_html, style_tag) {
    style_tag = style_tag.toLowerCase();

    var start = original_html.indexOf('<template>');
    var str = original_html;
    if (start >= 0) {
        start += +'<template>'.length;
        var end = original_html.lastIndexOf('</template>');
        str = original_html.substring(start, end);
    }

    str = idToViewId(str);
    var html = tagToViewType(str);


    var regExp = /<[a-z-]+/gi;
    var tags = html.match(regExp);
    tags = dedupe(tags);
    if (!tags) {
        return "";
    }

    // if (tags.indexOf("<div") < 0) {//如果这个html文件中没有写div的情况，会出现css选择失效，兼容下
    //     tags.push("<div");
    // }

    for (var i = 0; i < tags.length; i++) {
        var tagLeft = tags[i];
        if (tagLeft == "template") {
            continue;
        }

        html = addCssSelector(html, tagLeft, style_tag);
    }

    return html;
}

/**
 * 数组去重
 * @param array
 * @returns {any[]}
 */
var dedupe = function (array) {
    return Array.from(new Set(array));
}

let viewTypes = [
    {name: "view-item", tagNames: ["view-item", "item"]},
    {name: "view-scroll", tagNames: ["view-scroll", "scroll"]},
    {name: "view-group", tagNames: ["view-group", "group"]},
    {name: "view-frame", tagNames: ["view-frame", "frame"]},
    {name: "view-dialog", tagNames: ["view-dialog", "dialog"]},
    {name: "view-recycle", tagNames: ["view-recycle", "recycle"]},
    {name: "view-text", tagNames: ["view-text", "text"]},
    {name: "view-player", tagNames: ["view-player", "player"]},
    {name: "view", tagNames: ["view"]}
];

let tagToViewType = function (html) {
    for (let viewType of viewTypes) {
        html = tagToViewTypeBy(html, viewType.name, viewType.tagNames)
    }
    return html;
}

let tagToViewTypeBy = function (html, viewTypeName, tagNames) {
    tagNames.forEach(tagName => {
        //简单的穷举tagName的三种情况
        var regExp_0 = new RegExp("<" + tagName + " ", "gmi");
        html = html.replace(regExp_0, '<div view-type="' + viewTypeName + '" ');

        var regExp_1 = new RegExp("<" + tagName + "/", "gmi");
        html = html.replace(regExp_1, '<div view-type="' + viewTypeName + '"/');

        var regExp_2 = new RegExp("<" + tagName + ">", "gmi");
        html = html.replace(regExp_2, '<div view-type="' + viewTypeName + '">');

        html = html.replace(new RegExp("</" + tagName + ">", "gmi"), "</div>");
    })
    return html;
}

let idToViewId = function (html) {
    //简单的穷举id的三种情况
    var regExp = new RegExp(" id=", "gmi");
    html = html.replace(regExp, " view-id=");

    var regExp_1 = new RegExp("\"id=", "gmi");
    html = html.replace(regExp_1, "\" view-id=");

    var regExp_2 = new RegExp("\'id=", "gmi");
    html = html.replace(regExp_2, "\' view-id=");
    return html;
}

let addCssSelector = function (html, tagLeft, style_tag) {
//简单的穷举tagName的三种情况
    var regExp_0 = new RegExp(tagLeft + " ", "gmi");
    html = html.replace(regExp_0, tagLeft + " " + style_tag + ' ');

    var regExp_1 = new RegExp(tagLeft + "/", "gmi");
    html = html.replace(regExp_1, tagLeft + " " + style_tag + '/');

    var regExp_2 = new RegExp(tagLeft + ">", "gmi");
    html = html.replace(regExp_2, tagLeft + " " + style_tag + '">');

    return html;
}
