### proxy
1. 正向代理
  - 跳板机 进行用户验证 vpn
2. 反向代理
  - webpack, nginx中间层服务器 虚拟主机

### 模拟一下反向代理
1. 我本地的host网址为`hzi_1.cn`  `hzi_2.cn`
2. 定义一个map，hzi_1.cn代理到http://localhost:3000，hzi_2.cn代理到http://localhost:4000

代码如下
```
const http = require('http')
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer()

const map = {
  'hzi_1.cn': 'http://localhost:3000',
  'hzi_2.cn': 'http://localhost:4000'
}

http.createServer((req, res) => {
  proxy.web(req, res, {
    target: map[req.headers['host']]
  })
}).listen(80)
```
当然了，我们拿到被代理的服务器之后可以进行修改，返回自己想要的结果，修改如下
```
const http = require('http')
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer()

const map = {
  'hzi_1.cn': 'http://localhost:3000',
  'hzi_2.cn': 'http://localhost:4000'
}

http.createServer((req, res) => {
  proxy.on('proxyRes', function (proxyRes, req, res) {
    var body = [];
    proxyRes.on('data', function (chunk) {
      body.push(chunk);
    });
    proxyRes.on('end', function () {
      body = Buffer.concat(body).toString();
      console.log("res from proxied server:", body);
      res.end("my response to cli");
    });
  });
  proxy.web(req, res, {
    selfHandleResponse : true,
    target: map[req.headers['host']]
  })
}).listen(80)

```
