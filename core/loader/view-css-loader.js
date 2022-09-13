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
    let dirname = path.dirname(resourcePath);
    let filePath = path.resolve(__dirname, "../../src/css");
    let fileFilePath = dirname.replace(filePath, "");
    filename = filename.replace(".css","");
    if(fileFilePath){
        filename = fileFilePath + "/" + filename;
    }
    var hashcode = hash(filename);
    // console.log("css filename", filename,"hashcode",hashcode);
    var style_tag = "data-" + hashcode;
    var code = cssBuilder(source, style_tag);

    return code;

}