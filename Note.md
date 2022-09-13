## 构建项目笔记
### 1.初始化
生成package.json

```
npm init
```

package.json
```json
    {
      "name": "view-app",
      "version": "1.0.0",
      "description": "",
      "main": "webpack.config.js",
      "dependencies": {
        "webpack": "^5.58.1"
      },
      "devDependencies": {},
      "scripts": {
        "start": "webpack --config webpack.config.js"
      },
      "author": "kan尘埃",
      "license": "ISC"
    }

```

### 2.安装Webpack
安装模块

```
npm i -D
```

### 3.创建MyApp.js
在js文件夹下创建MyApp.js

```javascript
    var View = require('./core/View');
    
    var view = new View();
    console.log(view);

```

### 4.创建入口文件
默认入口文件 index.html

view-app.js要和webpack.config.js中module.exports.output.filename相同

```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>View-App</title>
    </head>
    <body>
    <div id="app"></div>
    <script src="./dist/view_app.js"></script>
    </body>
    </html>
```

### 5.创建webpack.config.js
在更目录创建文件 webpack.config.js
```javascript
    const path = require('path');
    module.exports = {
        entry: './js/MyApp',
        output: {
            filename: "view_app.js",//与入口中的js文件相同
            path: path.resolve(__dirname,'./dist')
        }
    }

```

此时应该有
* |-index.html
* |-js
    * |-Application.js
    * |-core
        * |-View.js
* |-webpack.config.js

### 6.执行Webpack命令构建

```
    npm i -D webpack
    npm install -D webpack-cli"
    npm run start
```

此时会在根目录生成dist文件夹，包含view_app.js

### 7.使用Loader
创建css文件夹，并且创建my_app.css

```css
    #app{
        text-align: center;
    }
```

#### 配置Loader
在webpack.config.js中添加，此时内容为

```javascript
    const path = require('path');
    module.exports = {
        entry: './js/MyApp',
        output: {
            filename: "view_app.js",
            path: path.resolve(__dirname,'./dist')
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader','css-loader']
                }
            ]
        }
    }
```

#### 安装Loader

```
    npm i -D style-loader css-loader
```

#### 修改MyApp.js

```javascript
    const View = require('./core/View');
    require('../css/my_app.css')
    
    var view = new View("hello view");
    View.$$('app').innerText = view.id;

```

这个时候运行，在页面上显示hello view居中效果

### 8.生成单独的css文件
在webpack.config.js 修改

```javascript
    const path = require('path');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    
    module.exports = {
        entry: './js/MyApp',
        output: {
            filename: "view_app.js",
            path: path.resolve(__dirname,'./dist')
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader,'css-loader']
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
                //filename: '[contenthash:8].css'
            })
        ]
    }
```

此时需要在index.html中导入css，才会生效样式

### 9.使用DevServer
调试、实时预览

安装
```
    npm i -D webpack-dev-server
```

在package.json中添加
```json
{
  "name": "view-app",
  "version": "1.0.0",
  "description": "",
  "main": "mian.js",
  "dependencies": {
    "webpack": "^5.58.1"
  },
  "devDependencies": {
    "css-loader": "^6.4.0",
    "mini-css-extract-plugin": "^2.4.2",
    "style-loader": "^3.3.0",
    "webpack-cli": "^4.9.0"
  },
  "scripts": {
    "start": "webpack --config webpack.config.js",
    "server": "webpack-dev-server --open --hot --devtool source-map"
  },
  "author": "kan尘埃",
  "license": "ISC"
}

```
在控制台输入

```
    npm run server
```

此时为空白页显示 'Cannot GET /'

添加html-webpack-plugin
安装
```
    npm i -D html-webpack-plugin
```

修改webpack.config.js

```javascript
    const path = require('path');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    
    module.exports = {
        entry: './js/MyApp',
        output: {
            filename: "view_app.js",
            path: path.resolve(__dirname,'./dist')
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader,'css-loader']
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name]_[contenthash:8].css'
            }),
            new HtmlWebpackPlugin({
                template: "./index.html",
                filename: "index.html"
            })
        ],
        mode: "development",
        loader: {
    
        }
    }
```

### 10.接入babel
安装插件
```
    npm i -D babel-plugin-transform-runtime
```

在webpack.config.js中添加

```javascript
    module.exports = {
        module: {
            rules:[
                {
                    test: /\.js$/,
                    use: ['babel-loader']
                }
            ]   
        },
        //使用source-map直接调试es6代码
        devtool: 'source-map',
    }
    
```

引入依赖

babel-loader@8无法使用bebal-core@6
```
    npm i -D babel-core babel-loader@7  //引入依赖
    //还未验证通过 npm i -D @babel/core babel-loader babel-plugin-transform-runtime  //高版本引入依赖
    //有点问题，不使用 npm i -D babel-preset-env   //包含了浏览器的兼容预设
```

新建babel配置文件
文件名 .babelrc
presets配置不填，如果有配置项，报错
```json
    {
      "plugins": [
        [
          "transform-runtime",
          {
            "polyfill": false
          }
        ]
      ],
      "presets": [
      ]
    }
```

打包成es5
* 将webpack.config.js中的"devtool: 'source-map'"注释掉
```javascript
    devtool: 'source-map'
```

### 11.使用Flow检查代码
由于presets问题，flow不使用



### 调试loader
    地址 chrome://inspect/#devices
```
    node --inspect-brk ./node_modules/webpack/bin/webpack.js
```



| 属性名                        | 含义                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| this.request                  | 被解析出来的 request 字符串。例子："/abc/loader1.js?xyz!/abc/node_modules/loader2/index.js!/abc/resource.js?rrr" |
| this.data                     | 在 pitch 阶段和正常阶段之间共享的 data 对象。                |
| this.resource                 | 当前处理文件完成请求路径，例如 /src/main.js?name=1           |
| this.context                  | 当前处理文件所在目录                                         |
| this.loaders                  | 所有 loader 组成的数组。它在 pitch 阶段的时候是可以写入的。  |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |
| this.loaderIndex              | 当前 loader 在 loader 数组中的索引。                         |
| this.async                    | 异步回调                                                     |
| this.callback                 | 回调                                                         |
| this.cacheable                | 默认情况下，loader 的处理结果会被标记为可缓存。调用这个方法然后传入 false，可以关闭 loader 的缓存。cacheable(flag = true: boolean) |
| this.resourcePath             | 当前处理文件的路径                                           |
| this.resourceQuery            | 查询参数部分                                                 |
| this.target                   | webpack配置中的target                                        |
| this.loadModule               | 但 Loader 在处理一个文件时，如果依赖其它文件的处理结果才能得出当前文件的结果时,就可以通过 this.loadModule(request: string, callback: function(err, source, sourceMap, module)) 去获得 request 对应文件的处理结果 |
| this.resolve                  | 解析指定文件路径                                             |
| this.addDependency            | 给当前处理文件添加依赖文件，依赖发送变化时，会重新调用loader处理该文件 |
| this.addContextDependency     | 把整个目录加入到当前正在处理文件的依赖当中                   |
| this.clearDependencies        | 清除当前正在处理文件的所有依赖中                             |
| this.emitFile                 | 输出一个文件                                                 |
| loader-utils.stringifyRequest | 把绝对路径转换成相对路径                                     |
| loader-utils.interpolateName  | 用多个占位符或一个正则表达式转换一个文件名的模块。这个模板和正则表达式被设置为查询参数，在当前loader的上下文中被称为name或者regExp |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |
|                               |                                                              |

