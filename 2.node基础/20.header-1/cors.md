### 需要得工具

- 安装node,nodemon
- nodemon得作用在于我们修改服务配置文件得时候不需要重启node，nodemon会帮我们做这个事情
- 我的node版本11.0.0

---

### 创建服务

- 请求文件服务器返回结果直接给浏览器
- 请求接口返回的结果给到xhr上去

1. 新建1.server.js,并创建一个index.html文件，设置服务器当客户端请求文件得时候我们返回这个index.html文件，代码如下：  
1.server.js
```
const fs = require('fs').promises
const path = require('path')
const url = require('url')
const http = require('http')

http.createServer(async(req, res) => {
  let { pathname } = url.parse(req.url, true)
  let absPath = path.resolve(__dirname, '.' + pathname)

  try {
    let statObj = await fs.stat(absPath)
    if(statObj.isFile()) {
      let content = await fs.readFile(absPath)
      res.end(content)
    } else {
      res.statusCode = 404
      res.end('Not Found')
    }
  } catch(e) {
    res.statusCode = 404
    res.end('Not Found')
  }
}).listen(3000)
```
index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  hello
</body>
</html>
```
我们访问http://localhost:3000/index.html 这个时候就可以访问成功了，可以看到输出index.html页面并显示hello  

我们对相同得请求资源路径返回不同处理结果,接下来我们分别进行get，post请求

2. get请求，示例： http://localhost:3000/user 我们将代码修改如下：
```
http.createServer(async(req, res) => {
  let { pathname } = url.parse(req.url, true)
  let absPath = path.resolve(__dirname, '.' + pathname)

  try {
    let statObj = await fs.stat(absPath)
    if(statObj.isFile()) {
      let content = await fs.readFile(absPath)
      res.end(content)
    } else {
      res.statusCode = 404
      res.end('Not Found')
    }
  } catch(e) {
    if(pathname === '/user') {
      switch (req.method) {
        case 'GET':
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            name: 'huangzi'
          }))
          break;
      
        default:
          break;
      }
    }
    res.statusCode = 404
    res.end('Not Found')
  }
}).listen(3000)
```
在html中加入这段js
```
<script>
  let xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://localhost:3000/user', true)
  xhr.onload = function(params) {
    console.log(typeof xhr.response)
    console.log(params.target.response)
  }
  xhr.send()
</script>
```
但是我们发现返回得结果typeof 得类型是string，如果我们想要json格式得，我们需要在js中加入
`xhr.responseType = 'json'` 类似于我们是jq得ajax中得`type: json`, 重试发现typeof为 object

3. post请求,post请求客户端需要传一些参数，服务端需要接受这些参数,代码如下:
```
<script>
  let xhr = new XMLHttpRequest()
  // xhr.open('GET', '/user', true)
  xhr.open('POST', 'http://localhost:3000/user', true)
  xhr.responseType = 'json'
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.onload = function(params) {
    console.log(typeof xhr.response)
    console.log(params.target.response)
  }
  xhr.send('a=1&b=2')
</script>
```
再次之贴出catch里面得代码，try中保持不变
```
let type = req.headers['content-type']
let arr = []
req.on('data', function(chunk) {
  arr.push(chunk)
})
req.on('end', function() {
  if (pathname === '/user') {
    switch (req.method) {
      case 'GET':
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          name: 'huangzi'
        }))
        break;
      case 'POST':
        if (type === 'application/x-www-form-urlencoded') {
          let str = Buffer.concat(arr).toString()
          let data = require('querystring').parse(str)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        }
        break;
      default:
        break;
    }
  }
  res.statusCode = 404
  res.end('Not Found')
})
```

---

### 简单请求和复杂请求

- 同时满足以下两大条件就属于简单请求  
  - 请求方法是以下三种方法之一
    - HEAD
    - GET
    - POST  
  - HTTP的头信息不超出以下几种字段：
    - Accept
    - Accept-Language
    - Content-Language
    - Last-Event-ID
    - Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain  
- 凡是不同时满足上面两个条件，就属于非简单请求。get/post+自定义header也是非简单请求

---

### 跨域问题

1. 简单请求
- 接下来我们使用vscode自启一个服务器端口为5500打开index.html,然后index.html中访问3000端口得接口，浏览器会禁止跨域，提示如下：  
`Access to XMLHttpRequest at 'http://localhost:3000/user' from origin 'http://localhost:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`  
那么我们在服务器端设置 `res.setHeader('Access-Control-Allow-Origin', '*')` 那么就可以访问并返回数据,代码如下：
```
req.on('end', function() {
      res.setHeader('Access-Control-Allow-Origin', '*')
      if (pathname === '/user') {
        switch (req.method) {
          case 'GET':
            res.setHeader('Content-Type', 'application/json') // 新增代码
            res.end(JSON.stringify({
              name: 'huangzi'
            }))
            break;
          case 'POST':
            if (type === 'application/x-www-form-urlencoded') {
              let str = Buffer.concat(arr).toString()
              let data = require('querystring').parse(str)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            }
            break;
          default:
            break;
        }
      }
      res.statusCode = 404
      res.end('Not Found')
    })
```

2. 如果是复杂请求  
- 例如是post + 自定义header, 如果我们在请求的时候加自定义header，即设置`xhr.setRequestHeader('token', 'admin')`，那么浏览器就会报错提示  
`Access to XMLHttpRequest at 'http://localhost:3000/user' from origin http://localhost:5500 has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status`  
提示浏览器会先进行一次option的试探请求，那么我们在服务器端这样设置  
<font style="color: #c00;font-weight:bold">注意：非简单请求的`CORS`请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）</font>
```
let type = req.headers['content-type']
    let arr = []
    req.on('data', function(chunk) {
      arr.push(chunk)
    })
    req.on('end', function() {
      res.setHeader('Access-Control-Allow-Origin', '*')
      // 新增代码
      if(req.method === 'OPTIONS') {
        res.end('')
        return
      }
      
      if (pathname === '/user') {
        switch (req.method) {
          case 'GET':
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              name: 'huangzi'
            }))
            break;
          case 'POST':
            if (type === 'application/x-www-form-urlencoded') {
              let str = Buffer.concat(arr).toString()
              let data = require('querystring').parse(str)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            }
            break;
          default:
            break;
        }
      }
      res.statusCode = 404
      res.end('Not Found')
    })
```
这时候我们再次发起请求，发现这个时候OPTIONS的预检请求成功了，但是浏览器会提示另一个错误  
`Access to XMLHttpRequest at 'http://localhost:3000/user' from origin 'http://localhost:5500' has been blocked by CORS policy: Request header field token is not allowed by Access-Control-Allow-Headers in preflight response.`  
就是说在发真正的请求的时候你这个自带的header是不允许的，需要在服务器端设置允许这个自定义的header，那么我们在服务端这样设置 `res.setHeader('Access-Control-Allow-Headers', 'token')` 这个时候我们在访问就ok了。

3. 最大存活时间
- 但是我们会发现另一个问题就是在，每次请求浏览器都会发起两次（当然很短的时间间隔的话，浏览器会发一次）请求，那么我们是否可以设置一个时间，在有效期内，不需要发起预检请求，过了有效时间会再次发起预检请求。我们可以在服务端这样设置 `res.setHeader('Access-Control-Max-Age', '10')`那么在10s内不会再次发起预检请求，现在代码如下(只显示设置header部分):
```
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-control-Allow-Headers', 'token')
res.setHeader('Access-Control-Max-Age', '10')
```

4. DELETE,PUT请求
- 如果我们使用delete请求(`xhr.open('DELETE', 'http://localhost:3000/user', true)`)，同样也是复杂请求，那么浏览器会提示  
`Access to XMLHttpRequest at 'http://localhost:3000/user' from origin 'http://localhost:5500' has been blocked by CORS policy: Method DELETE is not allowed by Access-Control-Allow-Methods in preflight response.`  
我们需要在服务端设置`res.setHeader('Access-control-Allow-Methods', 'DELETE, PUT, OPTIONS')`,并且在后续示例代码中添加对delete的处理就行了,这样我们就可以进行请求了
```
case 'DELETE':
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({
    name: 'huangzi'
  }))
  break;
```

5. 跨域携带cookie
- 首先我们在服务端被访问的时候对客户端设置cookie `res.setHeader('Set-Cookie', 'name=hzi')`,  同时我们在客户端请求的时候必须设置 `xhr.withCredentials = true` 强制携带cookie，这是我们请求会发现浏览器会报错提示  
`Access to XMLHttpRequest at 'http://localhost:3000/user' from origin 'http://localhost:5500' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.`  
大意就是跨域携带的cookie的是我们 `Access-Control-Allow-Origin` 不能设置为 `*` ,这是我们修改服务端 `res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500')` 并且需要设置 `res.setHeader('Access-Control-Allow-Credentials', true)`， 这个时候我们就会发现客户端已经顺利请求并打上了cookie
- 假如我们想让服务端任意其他域都可以访问，可以在服务端这样设置 `res.setHeader('Access-Control-Allow-Origin', req.headers.origin)` 这样得话，任何端口和域名都可以进行访问了

6. 完整代码如下
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  hello
</body>
<script>
  let xhr = new XMLHttpRequest()
  // xhr.open('GET', '/user', true)
  // xhr.open('POST', 'http://localhost:3000/user', true)
  xhr.open('DELETE', 'http://localhost:3000/user', true)
  xhr.responseType = 'json'
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.setRequestHeader('token', 'admin')
  xhr.withCredentials = true
  xhr.onload = function(params) {
    console.log(typeof xhr.response)
    console.log(params.target.response)
  }
  xhr.send('a=1&b=2')
</script>
</html>
```
```
const fs = require('fs').promises
const path = require('path')
const url = require('url')
const http = require('http')

http.createServer(async(req, res) => {
  let { pathname } = url.parse(req.url, true)
  let absPath = path.resolve(__dirname, '.' + pathname)

  try {
    let statObj = await fs.stat(absPath)
    if(statObj.isFile()) {
      let content = await fs.readFile(absPath)
      res.end(content)
    } else {
      res.statusCode = 404
      res.end('Not Found')
    }
  } catch(e) {
    let type = req.headers['content-type']
    let arr = []
    req.on('data', function(chunk) {
      arr.push(chunk)
    })
    req.on('end', function() {
      // 设置允许访问得域名
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      // 设置允许携带头部信息
      res.setHeader('Access-control-Allow-Headers', 'token')
      // 允许携带cookie
      res.setHeader('Access-Control-Allow-Credentials', true)
      // 设置允许非简单请求得方法
      res.setHeader('Access-control-Allow-Methods', 'DELETE, PUT, OPTIONS')
      // 设置option预检间隔时间，最大存活时间
      res.setHeader('Access-Control-Max-Age', '10')
      if(req.method === 'OPTIONS') {
        res.end('')
        return
      }

      if (pathname === '/user') {
        switch (req.method) {
          case 'GET':
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              name: 'huangzi'
            }))
            break;
          case 'POST':
            if (type === 'application/x-www-form-urlencoded') {
              let str = Buffer.concat(arr).toString()
              let data = require('querystring').parse(str)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            }
            break;
          case 'DELETE':
            res.setHeader('Set-Cookie', 'name=hzi')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              name: 'huangzi'
            }))
            break;
          default:
            break;
        }
      }
      res.statusCode = 404
      res.end('Not Found')
    })
  }
}).listen(3000)
```

---

### 相关文档
- github地址： https://github.com/xinlanlan/ALIPALN_DOC/tree/master/node%E5%9F%BA%E7%A1%80/AJAX
- 参考连接： http://www.ruanyifeng.com/blog/2016/04/cors.html














