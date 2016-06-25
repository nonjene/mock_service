# Mock Service

A mock API data service for frontend development. 

提供一个UI后台用作前端开发的模拟前后端数据对接

## 介绍
* 使用流程大概是在前端项目运行一个代理服务, 代理指向API服务端口, 当有请求发来时, API服务自动把请求push到UI后台, 

* 然后我们就可以在后台写一些测试数据发回给请求。 

* 支持post/get等类型的请求

* 后台的功能包涵JSON数据录入, 自动返回数据, 能查看请求参数及其它请求信息, 筛选请求捕捉等。

* 后台我们录入的数据是存在本地的indexedDB。

##Demo
先打开 [后台页面](http://knowsomething.us:3000/),
然后访问 [API服务链接](http://knowsomething.us:3001/) 就可以在后台页面看到访问的信息。

##依赖
需要有redis环境
MacOS上安装很简单, 以下命令:
```shell
brew install redis
```
运行:
```shell
redis-server
```

##使用
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