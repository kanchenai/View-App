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
    或
    npm run dev
```

打包
```
    npm run start
    或
    npm run build
```

参考了android的Application和activity实现整个页面的交互及生命周期


### 打包
注释webpack.config.js中的"devtool: 'source-map'"

解注释devtool: false
```javascript
    devtool: 'source-map',//打包时，注释掉这行
    // devtool: false,//打包时，解注释这行
```

将打包模式为生产模式
```javascript
    mode: "development"//运行环境：开发环境
    // mode: "production",//运行环境：生产环境
```

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
                player = new IptvPlayer();//iptv的播放器
            }catch (e){
                //其他播放器创建
                player = new AliWebPlayer();//阿里web播放器
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

#### Page构建
说明：控制页面渲染、操作，及业务逻辑的所在

* 定义,继承Page
```javascript
  export default class HomePage extends Page {
    
  }
```

* Page的constructor，这里定义当前Page的pageName，这个pageName需要和application.pageManager.pageTypeCallback中对应
```javascript
	export default class HomePage extends Page {
    constructor() {
      super();
      this.pageName = "HomePage";
    }
  }
```

* Page生命周期回调

```javascript
	export default class HomePage extends Page {
    //Page创建回调
    //页面的节点及滚动器创建
    //内部没有内容，需要在这个方法中调用this.html = "";设置布局
    onCreate(param){//param是传入的参数，param由application或上一个Page组装
      this.html = "<div></div>"；//这里的html一般由import引入
    }
    
    //Page执行到前台，页面已显示
    //1.从创建之后到前台
    //2.从其他Page返回当前Page
    onResume(){}
    
    //Page执行进入后台状态，页面已隐藏
    //跳转到其他页面时，有两种状态
    //1.当前页面暂停
    //2.当前页面关闭，紧接着会调用停止方法
    onPause(){
      //一般播放暂停在这里调用
    }
    
    //Page执行到停止
    onStop(){
      
    }
    
    //Page执行到销毁
    //页面回收、数据销毁
    onDestroy(){
      
    }
  }
```

  

* Page之间的数据传递
  
  1.跳转到新的Page

```javascript
	export default class HomePage extends Page {
    //页面默认的点击监听
    onClickListener(view) {
        console.log(view.pageName, "-onClickListener", view);
        var listPage = new ListPage();//ListPage是另一个Page
        this.startPage(listPage, {data: "llllll"});//第二个参数是传递到ListPage的数据
    }
  }
  
  export default class ListPage extends Page {
    oncreated(param){//由HomePage中传递的数据 {data: "llllll"}
      
    }
  }
```

​		2.返回到上一个页面

```javascript
	export default class ListPage extends Page {
    //重写返回键
    key_back_event() {
        this.setResult({data: "来自ListPage的数据"});
        this.finish();//回到上一个Page（HomePage）
    }
  }
	
  export default class HomePage extends Page {
    onResult(backResultData){//由ListPage回传的数据，{data: "来自ListPage的数据"}
      
    }
  }
  
```

* 播放器使用

```javascript
	export default class HomePage extends Page {
    onResume(){
      var playInfo = new PlayInfo("", 0, 0, 1280, 720);//播放地址，及视频位置
      this.player.play(0, playInfo);//从0开始播放
    }
  }
```



#### 组件介绍

未完待续，暂时可以参考Demo下的样例

#### 监听器注意点

* 监听器一般有点击、焦点变化、显示变化、滚动监听器
* 可以是用监听器设置，
  * 直接设置方法本体
  * 方法名设置，就是设置字符串，会寻找对应的方法作为监听器
  * 寻找对应的方法作为监听器，这个在listenerLocation（Page、Fragment或dialog内）
* 监听触发后，内部this指向，指向listenerLocation

方法寻找和监听器内部this指向的规则
```javascript
  this.html = "";//这个this，可以在监听器内部打印下this，来查看this具体是什么
```

#### 播放器对接注意点

* 实现RealPlayer的所有方法，播放器的基本功能就可以使用了
* 调教播放器，提升播放器体验，需要了解VideoPlayer的工作机制
* 在@src/util/AliWebPlayer是使用阿里h5播放器实现的，具体对接可以参考这个


#### 图片注意点

* 在html直接设置的图片要放置在images文件夹，直接使用
```html
    <img src="../images/bg.jpg" alt="">
```

* 在js中使用，动态设置的图片，要放置在images-js文件夹中，用import导入再使用
```javascript
    import pic_001 from "@images-js/pic_001.png"

    var image = holder.findViewById("pic");
    image.src = pic_001;
```

#### 文字跑马灯注意点

* 会自动加上overflow:hidden;line-height:{height}
* white-space: nowrap;判定为横向跑马灯
* 其他情况为纵向跑马灯；多个单词可能为多行，或者使用<br>强制换行，当多行时可执行纵向跑马灯

#### 全局滚动开关

State.ScrollAnimation值：
  true:打开
  false:关闭

* 在main.js
```javascript
  window.onload = function () {
    State.ScrollAnimation = true;//控制滚动动画开关
    //需要在css加载完之后才能启动app
    window.application = new MyApplication("app");
    window.application.launch();
  }
```

#### 代码现存问题


#### 开发者须知

* 1.该框架的运行环境 node，使用webpack打包
* 2.当前版在适配中需要调整编译的es版本，在必要时需要舍弃某些写法，使用其他写法，故版本中的框架核心代码都是源码
* 3.开发者有任何疑问，可以留言
* 4.如果有建议，也可留言，
  * 邮箱：269570492@qq.com
  * csdn地址：https://blog.csdn.net/zz609816880
* 5.目前作者只有一人，在IPTV行业有者5年开发经验，熟悉各种盒子的适配
* 6.该框架之前有一个前置版本，但在原公司深度使用，不便公开，但适配经验在本框架中适应，并在2年时间里已落地50个左右的项目，分别在全国不同地区、不同运营商落地

