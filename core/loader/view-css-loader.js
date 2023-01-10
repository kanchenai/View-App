const path = require('path');
const hash = require('hash-sum');//计算字符串hash值
const cssBuilder = require("./css-builder");

module.exports = function (source) {
    const {
        resourcePath,
    } = this;
    let filename = path.basename(resourcePath);//文件名
    let dirname = path.dirname(resourcePath);
    filename = filename.replace(".css","");

    let str = dirname.replace("/css", "")//mac
    str = str.replace("\\css", "")//win
    filename = str + "/" + filename;

    // console.log("---filename---", filename);

    var hashcode = hash(filename);
    // console.log("css filename", filename,"hashcode",hashcode);
    var style_tag = "data-" + hashcode;

    var code = cssBuilder(source, style_tag);
    return code;

}
