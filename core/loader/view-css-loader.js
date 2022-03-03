const path = require('path');
const hash = require('hash-sum');//计算字符串hash值
const cssBuilder = require("./css-builder");

module.exports = function (source) {
    const {
        target,
        request,
        minimize,
        sourceMap,
        rootContext,
        resourcePath,
        resourceQuery = ''
    } = this;
    let filename = path.basename(resourcePath);//文件名
    filename = filename.replace(".css","");
    // var page = new LoaderPage(source, filename);
    var hashcode = hash(filename);
    var style_tag = "data-" + hashcode;
    var code = cssBuilder(source, style_tag);

    return code;

}