# Mock Service

A mock API data service for frontend development. 

## 介绍
使用流程大概是在前端项目运行一个代理服务,代理指向API服务端口, 当有请求发来时, API服务会把请求push到UI后台, 
然后我们就可以在后台写一些测试数据发回给请求。 
支持所有类型的请求(post/get等)
后台包涵JSON数据录入, 自动返回数据, 能查看请求参数及其它请求内容, 筛选请求捕捉等。
后台我们录入的数据是存在本地的indexedDB。

##Demo
先打开 [后台页面](http://knowsomething.us:3000/),
然后访问 [API服务链接](http://knowsomething.us:3001/) 就可以在后台页面看到访问的信息。


##使用
可选两种使用方式:

### 方式一:直接clone代码

然后安装依赖, 运行:
```shell
npm install --production
```
默认的后台端口是3000, 访问端口是3001

运行API服务及后台:
```shell
npm run start
```
然后浏览器打开后台:`http://localhost:3000`

然后就可以测试是否可运行了:
访问: `http://localhost:3001/some/api/request`

查看后台页面,就会收到请求信息了。

然后可以在前端项目建一个80端口的服务代理到3001端口,就OK啦。详见`./demo/index.js`


### 方式二: 安装express或koa的中间件
todo

## LICENSE
MIT