## 防盗链的简单介绍

我在本地的host做了一下设置
- 127.0.0.1 hzi_1.cn
- 127.0.0.1 hzi_2.cn

---

### 创建服务

1. 启用服务 2.server.js
2. 我们访问 http://localhost:3000/refer.html ，我们让hzi_2.cn访问hzi_1.cn的图片，结果返回是404，因为我们做了防盗链
3. 可以设置白名单`whiteList = ['hzi_1.cn']` 这样2的就可以访问1的图片了

2.server.js
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
      if(pathname.match(/\.jpg/)) {
        let referer = req.headers['referrer'] || req.headers['referer']
        if(referer) {
          let host = req.headers.host.split(':')[0]
          referer = url.parse(referer).hostname
          
          let whiteList = ['hzi_2.cn']
          if(referer !== host && !whiteList.includes(referer)) {
            let content = await fs.readFile(path.resolve(__dirname, '2.jpg'))
            res.end(content)
            return
          }
        }
      }

      let content = await fs.readFile(absPath)
      res.end(content)
    } else {
      res.statusCode = 404
      res.end('Not Found')
    }
  } catch (e) {
    res.statusCode = 404
    res.end('Not Found')
  }
}).listen(3000)
```
refer.html
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
  <img src="http://hzi_1.cn:3000/1.jpg" alt="">
</body>
</html>
```