const path = require('path');
const hash = require('hash-sum');//计算字符串hash值
const cssBuilder = require("./css-builder");
const sass = require('sass');

module.exports = function (source) {
    const {
        resourcePath,
    } = this;
    let filename = path.basename(resourcePath);//文件名
    let dirname = path.dirname(resourcePath);

    filename = filename.replace(/\.(css|scss)$/, "");
    let str = dirname.replace(/\/css|\\css/, "");

    filename = str + "/" + filename;

    // console.log("---filename---", filename);

    var hashcode = hash(filename);
    // console.log("css filename", filename,"hashcode",hashcode);
    var style_tag = "data-" + hashcode;

    source = sass.compileString(source).css; // 无论是css还是scss都转换一下
    var code = cssBuilder(source, style_tag);
    return code;

}
