# Mock Service

A mock API data service for frontend development. 

这个工具提供一个UI后台，可以利用浏览器的indexedDB数据库创建模拟数据，并匹配请求的路径返回数据。以用作前端开发的模拟前后端数据对接。

## 介绍

* 使用流程是前端项目通过链接的指向或者代理服务到本服务，当有请求发来时, 本服务将把请求通过ws push到后台页面，

* 然后我们就可以在后台写一些测试数据发回给请求。 

* 支持post/get等类型的请求

* 后台的功能包涵JSON数据录入, 自动返回数据, 能查看请求参数及其它请求信息, 筛选请求捕捉等。

* 后台我们录入的数据是存在本地的indexedDB。

## Demo
  
  打开[后台页面demo](http://138.128.223.51:3000/#home)

  切换到`自动匹配`, 选中`自动返回`，然后点击`新建 API`，在新增的空白卡片上，第一行添加`/some/api/request`, 第二行选择`数据例子`。

  然后访问服务[http://138.128.223.51:3001/some/api/request](http://138.128.223.51:3001/some/api/request)

  然后就能得到`数据例子`的数据内容`{"code":0, "msg":"success", "data":"hello world!"}`

  可以切回`主面板`，左侧编辑好模拟数据之后，然后点击`新增到数据列表`，回到`自动匹配`即可选择刚才添加的数据了。

## 依赖
需要有redis环境
MacOS上安装很简单, 以下命令:
```shell
brew install redis
```
运行:
```shell
redis-server
```

## 使用
可选两种使用方式:

### 方式一:直接clone代码
```shell
git clone https://github.com/nonjene/mock_service.git
```

然后安装依赖, 运行:
```shell
npm install --production
```
默认的后台端口是3000, 访问端口是3001。 (可在`./config/config.json`修改)

运行API服务及后台:
```shell
npm run start
```
然后浏览器打开后台:`http://localhost:3000`

然后就可以测试是否可运行了:
访问: `http://localhost:3001/some/api/request`

查看后台页面,就会收到请求信息了。

然后可以在前端项目建一个80端口的服务代理到3001端口,就OK啦。详见`./demo/index.js`


### 方式二: 作为express或koa服务的中间件
安装中间件:
```shell
npm install mock_service
```
使用:
```js
var mockService = require("mock_service");

app.use(mockService({
    webSocketConfig: {port: 3336},
    redisConfig: {port: 6379},
    adminPort: 3000
}))
```

## LICENSE
MIT