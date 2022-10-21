const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main',
    output: {
        filename: "view_app.js",
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,//也可以是数组
                exclude: path.resolve(__dirname, 'src/css'),
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                resolve: {}
            },
            {
                test: /\.css$/,//也可以是数组
                include: path.resolve(__dirname, 'src/css'),
                use: [MiniCssExtractPlugin.loader, 'css-loader', "view-css-loader"],
                resolve: {}
            },
            {
                //匹配js，使用babel-loader进行代码转化
                // test:/\.js$/,
                // use:{
                //     loader: "babel-loader"
                // }
            },
            {
                test: [/\.html$/],
                include: path.resolve(__dirname, 'src/html/'),
                use: ["html-loader", "view-html-loader"],
            },
            // {
            //     test: [/\.html$/],
            //     include: path.resolve(__dirname,'src/test/'),
            //     use:["html-loader","view-html-loader"]
            // },
            {
                test: [/\.png$/, /\.jpg$/, /\.jpeg$/, /\.gif$/],
                include: path.resolve(__dirname, 'src/images-js/'),//exclude：可以显示在html中的图片；include:不能显示html的图片,可以使用import导入
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[contenthash:8].[ext]",
                        output: "imgs",
                    }
                },
            }
        ],
        // noParse: /jquery/
    },
    resolve: {
        alias: {
            "@core": path.resolve(__dirname, "core"),
            "@src": path.resolve(__dirname, "src"),
            "@css": path.resolve(__dirname, "src/css"),
            "@fragment": path.resolve(__dirname, "src/fragment"),
            "@html": path.resolve(__dirname, "src/html"),
            "@images": path.resolve(__dirname, "src/images"),
            "@images-js": path.resolve(__dirname, "src/images-js"),//用在js赋值s图片
            "@page": path.resolve(__dirname, "src/page"),
        },//字符替换规则
        mainFields: ['browser', 'main'],//编译版本匹配，没懂
        extensions: ['.js', '.json', '.html'],//文件后缀比配
        modules: ['node_modules'],//第三方模块位置
        descriptionFiles: ['package.json'],//第三方模块描述
        enforceExtension: false,

    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html"
        })
    ],
    mode: "development",//运行环境：开发环境
    // mode: "production",//运行环境：生产环境

    performance: {
        hints: 'error',//提示等级
        maxAssetSize: 2 * 1024 * 1024, // 文件大小提示阈值，整数类型（以字节为单位）1M，超过这个大小，会提示
        maxEntrypointSize: 2 * 1024 * 1024 // 文件大小性能阈值，整数类型（以字节为单位）1M，超过这个大小，打包失败
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, "./core/loader"), 'node_modules']
    },
    // devServer: {//一般使用默认
    // }
    //使用source-map直接调试es6代码
    devtool: 'source-map',
    stats: "none",
}
