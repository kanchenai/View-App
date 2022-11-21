const path = require('path');
const hash = require('hash-sum');//计算字符串hash值
const htmlBuilder = require("./html-builder");


module.exports = function (source) {
    const {
        resourcePath,
    } = this;
    let filename = path.basename(resourcePath);//文件名
    let dirname = path.dirname(resourcePath);
    filename = filename.replace(".html", "");

    let str = dirname.replace("/html", "")
    filename = str + "/" + filename;

    // console.log("---filename---", filename);

    var hashcode = hash(filename);
    // console.log("html filename", filename,"hashcode",hashcode);
    var style_tag = "data-" + hashcode;
    var code = htmlBuilder(source, style_tag);
    return code;

}
