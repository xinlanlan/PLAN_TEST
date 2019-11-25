## 在上一篇的基础上简单的说一下jsonp

### jsonp的原理
1. 动态的创建script标签，并将script添加到body中，在前端定义一个全局方法，后端返回一段js并立即执行这个方法，拿到服务端的数据。主要是因为script标签的引入不存在跨域问题

2. 代码如下(在上一篇的基础上)  
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
  <button id="load">点击</button>
</body>
<script>
  let xhr = new XMLHttpRequest()
  // xhr.open('GET', '/user', true)
  // xhr.open('POST', 'http://localhost:3000/user', true)
  xhr.open('DELETE', 'http://localhost:3000/user', true)
  xhr.responseType = 'json'
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.withCredentials = true
  xhr.setRequestHeader('token', 'a')
  xhr.onload = function(params) { //onload相当于服务器返回200， readState = 4 h5的新特性
    console.log(typeof xhr.response)
  }
  xhr.send('a=1&b=1')

  function hzi(data) {
    console.log(data)
  }

  load.addEventListener('click',function () {
    let script = document.createElement('script')
    script.src = 'http://localhost:3000/jsonp?callback=hzi'
    document.body.appendChild(script)
  })
</script>
</html>
```
1.server.js
```
const http = require('http')
const url = require('url')
const fs = require('fs').promises
const path = require('path')

http.createServer(async (req, res) => {
  let { pathname, query } = url.parse(req.url, true)  // 第二个true的参数将url参数转化为对象
  let absPath = path.resolve(__dirname, '.' + pathname)
  try {
    let statObj = await fs.stat(absPath)
    if (statObj.isFile()) {
      let content = await fs.readFile(absPath)
      res.end(content)
    } else {
      res.statusCode = 404
      res.end('Not Found')
    }
  } catch (e) {
    let type = req.headers['content-type']
    let arr = []
    req.on('data', function(chunk) {
      arr.push(chunk)
    })
    req.on('end', function () {
      // 允许那些域
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      // 允许那些复杂请求
      res.setHeader('Access-control-Allow-Methods', 'DELETE, PUT, OPTIONS')
      // 允许携带cookie凭证
      res.setHeader('Access-Control-Allow-Credentials', true);
      // 允许携带哪些header
      res.setHeader('Access-Control-Allow-Headers', 'token')
      // 最大存活时间是多少
      res.setHeader('Access-Control-Max-Age', '5')
      if(req.method === 'OPTIONS') {
        res.end('')
        return
      }
      if (pathname === '/user') {
        switch (req.method) {
          case 'GET':
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              name: 'zf'
            }))
            break;
          case 'POST':
            if(type === 'application/x-www-form-urlencoded') {
              let str = Buffer.concat(arr).toString()
              let data = require('querystring').parse(str)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            }
          case 'DELETE':
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Set-Cookie', 'name=hzi')
            res.end(JSON.stringify({
              name: 'zf'
            }))
            break;
          default:
            break;
        }
      }
      if (pathname === '/jsonp') {
        return res.end(`${query.callback}(a=1)`)
      }
      res.statusCode = 404
      res.end('Not Found')
    })
  }
}).listen(3000)
```
这个时候使用5500端口进行访问，那么服务端会报一个这个样的错误，`Invalid value "undefined" for header "Access-Control-Allow-Origin"`首先script标签并没有涉及到跨域问题，其次，加载script标签的时候并没有`req.headers.origin`,修改如下,就是在外层加了一个if语句而已
```
const http = require('http')
const url = require('url')
const fs = require('fs').promises
const path = require('path')

http.createServer(async (req, res) => {
  let { pathname, query } = url.parse(req.url, true)  // 第二个true的参数将url参数转化为对象
  let absPath = path.resolve(__dirname, '.' + pathname)
  try {
    let statObj = await fs.stat(absPath)
    if (statObj.isFile()) {
      let content = await fs.readFile(absPath)
      res.end(content)
    } else {
      res.statusCode = 404
      res.end('Not Found')
    }
  } catch (e) {
    let type = req.headers['content-type']
    let arr = []
    req.on('data', function (chunk) {
      arr.push(chunk)
    })
    req.on('end', function () {
      if (req.headers.origin) {
        // 允许那些域
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
        // 允许那些复杂请求
        res.setHeader('Access-control-Allow-Methods', 'DELETE, PUT, OPTIONS')
        // 允许携带cookie凭证
        res.setHeader('Access-Control-Allow-Credentials', true);
        // 允许携带哪些header
        res.setHeader('Access-Control-Allow-Headers', 'token')
        // 最大存活时间是多少
        res.setHeader('Access-Control-Max-Age', '5')
        if (req.method === 'OPTIONS') {
          res.end('')
          return
        }
        if (pathname === '/user') {
          switch (req.method) {
            case 'GET':
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                name: 'zf'
              }))
              break;
            case 'POST':
              if (type === 'application/x-www-form-urlencoded') {
                let str = Buffer.concat(arr).toString()
                let data = require('querystring').parse(str)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              }
            case 'DELETE':
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Set-Cookie', 'name=hzi')
              res.end(JSON.stringify({
                name: 'zf'
              }))
              break;
            default:
              break;
          }
        }
      }

      if (pathname === '/jsonp') {
        return res.end(`${query.callback}(a=1)`)
      }
      res.statusCode = 404
      res.end('Not Found')
    })
  }
}).listen(3000)
```

