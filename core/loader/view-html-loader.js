const path = require('path');
const hash = require('hash-sum');//计算字符串hash值
const loadUtils = require("loader-utils");
const schemaUtils = require("schema-utils");
const htmlBuilder = require("./html-builder");


module.exports = function (source) {
    // var options = loadUtils.getOptions(this);
    // console.log(options)
    // return page.parsePage();
    // this.callback(null,page.parsePage(),sourceMaps);

    // schemaUtils.validate()

    // console.log("1---request",this.request);

    // this.loadModule(this.request, function(err, source, sourceMap, module){
    //     console.log("2---source",source);
    //     console.log("2---request",this.request);
    // });

    // var hashcode = hash("11");
    const {
        target,
        request,
        minimize,
        sourceMap,
        rootContext,
        resourcePath,
        resourceQuery = ''
    } = this;
    debugger;
    let filename = path.basename(resourcePath);//文件名
    let dirname = path.dirname(resourcePath);
    let filePath = path.resolve(__dirname, "../../src/html");
    let fileFilePath = dirname.replace(filePath, "");
    filename = filename.replace(".html", "");

    if(fileFilePath){
        filename = fileFilePath + "/" + filename;
    }
    var hashcode = hash(filename);
    // console.log("html filename", filename,"hashcode",hashcode);
    var style_tag = "data-" + hashcode;
    var code = htmlBuilder(source, style_tag);
    return code;

}