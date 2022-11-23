/**
 * 将css加上样式属性
 * TODO css正则：/^[^\/]([\.\#]?[\w-]+[ ]?[^,])+({|,|\n)/gim
 * @param original_html
 * @returns {string}
 */
module.exports = function (css, style_tag) {
    var reg = /^[^\/]([\.\#]?[\w-]+[ ]?[^,])+({|,|\n)/gim;
    style_tag = "[" + style_tag.toLowerCase() + "]";

    css = css.replace(reg,function (val){
        var str = val.replace(new RegExp(",", "gmi"), style_tag + "," );

        str = str.replace(new RegExp("{| {", "gmi"), style_tag + " {" );
        return str
    })

    // var divLeft = "[" + style_tag + "]," ;
    // css = css.replace(new RegExp(",", "gmi"), style_tag + "," );
    //
    // var divLeft = "[" + style_tag + "]{" ;
    // css = css.replace(new RegExp("{| {", "gmi"), style_tag + " {" );

    return css;
}
