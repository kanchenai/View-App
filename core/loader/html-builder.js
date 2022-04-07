/**
 * 将html加上标签属性，区分样式渲染
 * @param original_html
 * @returns {string}
 */
module.exports = function (original_html, style_tag) {
    style_tag = style_tag.toLowerCase();
    var regExp = /<[a-z-]+( |[^>\/)])/gi;

    var start = original_html.indexOf('<template>');
    var str = original_html;
    if (start >= 0) {
        start += +'<template>'.length;
        var end = original_html.lastIndexOf('</template>');
        str = original_html.substring(start, end);
    }

    var tags = str.match(regExp);
    tags = dedupe(tags);
    if (!tags) {
        return "";
    }
    var html = str;
    for (var i = 0; i < tags.length; i++) {
        var tagLeft = tags[i];
        if(tagLeft == "template"){
            continue;
        }
        // var tagRight = "</" + view_types[i] + ">";
        // var divLeft = "<div data-" + style_tag;
        var divLeft = "";
        if(tagLeft.indexOf(" ") < 0){
            divLeft = tagLeft + " "+style_tag + " ";
        }else{
            divLeft = tagLeft + style_tag + " ";
        }

        html = html.replace(new RegExp(tagLeft, "gmi"), divLeft);
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