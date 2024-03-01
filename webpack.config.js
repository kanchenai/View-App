const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['@babel/polyfill', './src/main'],//引入es6中无法被编译的新api
    // entry: './src/main',
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, './dist'),
        clean: true,//清除上次打包文件
        environment: {//不使用用箭头函数
            arrowFunction: false
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, 'src/css'),
                    path.resolve(__dirname, 'core/frame/view/css'),
                    path.resolve(__dirname, 'src/custom-view')
                ],
                use: [
                    MiniCssExtractPlugin.loader, // 提取 CSS 到单独文件
                    'css-loader', // 处理 CSS 文件
                    'sass-loader', // 将 SCSS 转换为 CSS
                    'view-css-loader' 
                ]
            },
            {
                test: /\.css$/,//也可以是数组
                exclude: [
                    path.resolve(__dirname, 'src/css'),
                    path.resolve(__dirname, 'core/frame/view/css'),
                    path.resolve(__dirname, 'src/custom-view')
                ],
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                resolve: {}
            },
            {
                test: /\.css$/,//也可以是数组
                include: [
                    path.resolve(__dirname, 'src/css'),
                    path.resolve(__dirname, 'core/frame/view/css'),
                    path.resolve(__dirname, 'src/custom-view')
                ],
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
                include: [
                    path.resolve(__dirname, 'src/html/'),
                    path.resolve(__dirname, 'core/frame/view/html/'),
                    path.resolve(__dirname, 'src/custom-view')
                ],
                use: ["html-withimg-loader", "view-html-loader"],
            },
            // {
            //     test: [/\.html$/],
            //     include: path.resolve(__dirname,'src/test/'),
            //     use:["html-loader","view-html-loader"]
            // },
            // {
            //     test: [/\.png$/, /\.jpg$/, /\.jpeg$/, /\.gif$/],
            //     include: path.resolve(__dirname, 'src/images-js/'),//exclude：可以显示在html中的图片；include:不能显示html的图片,可以使用import导入
            //     use: {
            //         loader: "file-loader",
            //         options: {
            //             name: "static/[path][name].[ext]",
            //             output: "imgs",
            //         }
            //     },
            // },
            {
                test: [/\.png$/, /\.jpg$/, /\.jpeg$/, /\.gif$/],//使用地址引入的图片，使用这个打包
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
            filename: "index.html",
            title: require("./package.json").name,//页面标题
            favicon: "./public/logo.png"//页面标题图标
        })
    ],
    //运行环境：开发环境、生产换进，npm run *有选择（不传就是默认development开发环境）
    mode: "development",//运行环境：开发环境
    // mode: "production",//运行环境：生产环境

    performance: {
        hints: 'error',//提示等级
        maxAssetSize: 2 * 1024 * 1024, // 文件大小提示阈值，整数类型（以字节为单位）1M，超过这个大小，会提示
        maxEntrypointSize: 2 * 1024 * 1024 // 文件大小性能阈值，整数类型（以字节为单位）1M，超过这个大小，打包失败
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, "./core/loader"), 'node_modules']//loader先在./core/loader找，然后再在node_modules找
    },

    //是否使用devtool:source-map，npm run *有选择是否使用（不传就是默认不使用）
    // devtool: 'source-map',//使用
    // devtool: false,//不使用
    stats: "errors-only",

    devServer:{
        // host: 'localhost',
        // port: 8090,
        // proxy: {
        //     '/interface/': {
        //         target: 'http://localhost:8080',// 本地
        //         changeOrigin: true,
        //         pathRewrite: {
        //         }
        //     }
        // },
    },// dev环境下，webpack-dev-server 相关配置
}
