/**
 * 将css加上样式属性
 * TODO css正则：/^[^\/]([\.\#]?[\w-]+[ ]?[^,])+({|,|\n)/gim
 * @param original_html
 * @returns {string}
 */
module.exports = function (css, style_tag) {
    debugger;
    style_tag = style_tag.toLowerCase();

    var divLeft = "[" + style_tag + "]," ;
    css = css.replace(new RegExp(",", "gmi"), divLeft);

    var divLeft = "[" + style_tag + "]{" ;
    css = css.replace(new RegExp("{| {", "gmi"), divLeft);

    return css;
}