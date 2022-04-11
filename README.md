# view-app
这是一个在原生js基础上开发的针对iptv行业的交互框架

环境
* node环境
* 使用webpack打包

初始化工程
```
    npm install
```

运行
```
    npm run server
```

参考了android的Application和activity实现整个页面的交互及生命周期


### 起步
#### Application启动

* 在/View-App.js确定使用哪个Application，一般会写一个Application的子类
* 调用application的launch方法，启动应用

```javascript
    import './src/css' //页面对应样式，全局导入

    import MyApplication from "./src/MyApplication";//Application的自定义子类

    var start = new Date().getTime();//启动前的时间
    window.onload = function () {//在onload中启动，是因为css文件加载是异步的
        //需要在css加载完之后才能启动app
        window.application = new MyApplication("app");//创建应用
        window.application.launch();//启动应用

        console.log(new Date().getTime() - start)//打印启动应用的时长
    }
```

#### 自定义Application

* 继承Application
```javascript
    export default class MyApplication extends Application {
    
    }
```

* 重写onlaunch方法
  onlaunch方法返回的Page是应用启动的第一个Page
```javascript
    export default class MyApplication extends Application {
        onLaunch(urlParam) {
            console.log("onLaunch，地址栏参数：", urlParam);//外部在地址栏中传递的参数
            var firstPage = null;
            var param = null;//这个是传递给第一个Page的参数
            switch (urlParam.pageKey) {//根据参数中的规定key对应的值选择哪个Page是第一个Page
                case "home":
                    firstPage = new HomePage();
                    break;
                default:
                    firstPage = new TestPage();//默认第一个Page
                    break;
            }
            return {firstPage, param};//返回第一个Page，及对应的参数
        }
    }
    
```

* 剩余生命周期的回调方法
```javascript
    export default class MyApplication extends Application {
        //应用创建，启动第一个页面之前调用
        onCreate(page, param){//page为第一个Page，param为对应的参数
            
        }
    
        //应用停止，一般在跳转到外部，和销毁应用时调用
        onStop(){}
    
        //应用销毁，跳转到外部不会调用该方法，只有销毁时会调用
        //如果是android混合模式，可以在这里调用关闭WebView或关闭android app
        onDestroy(){}
    }
    
```

* 正常退出应用的

```javascript
    export default class MyApplication extends Application {
        //如果是android混合模式，也可以在这里调用关闭WebView或关闭android app
        exitUrl() {
            var url = "";//退出应用跳转的地址，这地址可以自定义，一般由启动应用时，地址栏中的参数，比如：backUrl、returnUrl等
            return url;
        }
    }
```

* 全局播放器

```javascript
    export default class MyApplication extends Application {
        getPlayerInstance() {
            var player = {};
            try{
                player = new IptvPlayer(this.keyboard);//iptv的播放器
            }catch (e){
                //TODO 其他播放器创建，在浏览器中调试，可以使用videojs
                console.warn("播放器创建失败")
            }
            return player;
        }
    }
```

* 跳转到外部，返回应用时

  这里主要是为跳转到外部返回应用后，所显示的Page
```javascript
    export default class MyApplication extends Application {
        constructor(id) {
            super(id);
            //重写pageManager.pageTypeCallback，其中pageName在每个Page中的pageName对应
            this.pageManager.pageTypeCallback = function (pageName) {
                var page = null;
                switch (pageName) {
                    case "HomePage"://对应下方HomePage的constructor中的赋值的pageName
                        page = new HomePage();
                        break;
                    case "ListPage":
                        page = new ListPage();
                        break;
                    case "TestPage":
                        page = new TestPage();
                        break;
                }
                return page;
            }
        }
    }
```

```javascript
    export default class HomePage extends Page {
        constructor() {
            super();
            this.pageName = "HomePage";
        }
    }
```

#### Page构建
未完待续，暂时可以参考/src/page下的样例








#### 开发者须知

* 1.该框架的运行环境 node，使用webpack打包
* 2.当前版在适配中需要调整编译的es版本，在必要时需要舍弃某些写法
* 3.开发者有任何疑问，可以留言
* 4.如果有建议，也可留言
* 5.目前作者只有一人，在IPTV行业有者5年开发经验，熟悉各种盒子的设配
* 6.该框架之前有一个前置版本，但在原公司深度使用，不便公开，但适配经验在本框架中适应，在2年时间里已落地50个左右的项目，在全国不同地区、运营商落地

