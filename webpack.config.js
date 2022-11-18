const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main',
    output: {
        filename: "[name].js",
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
                //匹配js，使用babel-loader进行代码转化,将代码转成es5（配置在.babelrc文件）
                test: /\.js$/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: [/\.html$/],
                include: path.resolve(__dirname, 'src/html/'),
                use: ["html-withimg-loader", "view-html-loader"],
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
                        name: "static/[path][name].[ext]",
                        output: "imgs",
                    }
                },
            },
            {
                test: [/\.png$/, /\.jpg$/, /\.jpeg$/, /\.gif$/],//使用地址引入的图片，使用这个打包
                exclude: path.resolve(__dirname, 'src/images-js/'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        name: 'static/[path][name].[ext]',
                        context: path.resolve(__dirname, './src'),//过滤掉[path]的相对路径
                        publicPath: './',
                        esModule: false
                    }

                }]

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
    devtool: 'source-map',//打包时，注释掉这行
    // devtool: false,//打包时，解注释这行
    stats: "errors-only",
}
