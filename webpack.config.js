const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './View-App',
    output: {
        filename: "view_app.js",
        path: path.resolve(__dirname,'./dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,//也可以是数组
                exclude: path.resolve(__dirname,'src/css'),
                use: [MiniCssExtractPlugin.loader,'css-loader'],
                resolve: {}
            },
            {
                test: /\.css$/,//也可以是数组
                include: path.resolve(__dirname,'src/css'),
                use: [MiniCssExtractPlugin.loader,'css-loader',"view-css-loader"],
                resolve: {}
            },
            // {
            //     //匹配js，使用babel-loader进行代码转化
            //     test:/\.js$/,
            //     use:[{
            //         loader: "babel-loader"
            //     }]
            // },
            {
                test: [/\.html$/],
                include: path.resolve(__dirname,'src/html/'),
                use:["html-loader","view-html-loader"]
            },
            // {
            //     test: [/\.html$/],
            //     include: path.resolve(__dirname,'src/test/'),
            //     use:["html-loader","view-html-loader"]
            // }
            {
                test: [/\.png$/,/\.jpg$/,/\.jpeg$/,/\.gif$/],
                include: path.resolve(__dirname,'src/html/'),
                use:["file-loader"]
            }
        ],
        // noParse: /jquery/
    },
    resolve: {
        alias: {
            "@core":path.resolve(__dirname,"core"),
            "@src":path.resolve(__dirname,"src"),
            "@css":path.resolve(__dirname,"src/css"),
            "@fragment":path.resolve(__dirname,"src/fragment"),
            "@html":path.resolve(__dirname,"src/html"),
            "@images":path.resolve(__dirname,"src/images"),
            "@page":path.resolve(__dirname,"src/page"),
        },//字符替换规则
        mainFields: ['browser','main'],//编译版本匹配，没懂
        extensions: ['.js','.json','.html'],//文件后缀比配
        modules: ['node_modules'],//第三方模块位置
        descriptionFiles: ['package.json'],//第三方模块描述
        enforceExtension: false,

    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html"
        })
    ],
    mode: "development",
    resolveLoader: {
        modules: [path.resolve(__dirname,"./core/loader"),'node_modules']
    },
    // devServer: {//一般使用默认
    // }
    //使用source-map直接调试es6代码
    devtool: 'source-map',
}
