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
    filename = filename.replace(".html","");
    // var page = new LoaderPage(source, filename);
    var hashcode = hash(filename);
    var style_tag = "data-" + hashcode;
    var code = htmlBuilder(source, style_tag);
    return code;

}

class LoaderPage {
    constructor(source, filename) {
        this.source = source;
        this.filename = filename;
        this.style = this.getStyle();
        this.html = this.getHtml();
        this.js = this.getJs();
    }

    getStyle() {
        var start = this.source.indexOf('<style>');
        if (start < 0) {
            return "";
        }
        start += '<script>'.length;
        var end = this.source.indexOf('</style>');
        return this.source.substring(start, end);
    }

    getHtml() {
        var start = this.source.indexOf('<page>');
        if (start < 0) {
            return "";
        }
        start += +'<page>'.length;
        var end = this.source.indexOf('</page>');
        var str = this.source.substring(start, end);
        var style_tag = this.filename.replace(".html", "");
        debugger;
        str = htmlBuilder(str, style_tag);
        return str;
    }

    getJs() {
        var start = this.source.indexOf('<script>');
        if (start < 0) {
            return "";
        }
        start += +'<script>'.length;
        var end = this.source.indexOf('</script>');
        return this.source.substring(start, end);
    }
}

