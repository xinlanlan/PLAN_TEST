### cookie
存储在浏览器中，在浏览器中可以被篡改，可以增加签名，每次请求会携带，大小不能超过4k

### session
- 基于cookie，存在于浏览器中
- 相对安全，但是相应得会又csrf攻击
- 服务器重启，sesion会消失，一般存在redis，mongo中，受大小和内存得限制
- csrf攻击参考这篇文章 https://www.cnblogs.com/collin/articles/9637999.html

### cookie得读取和存储
```
const http = require('http')

http.createServer((req, res) => {
  req.getCookie = function(key) {
    let obj = require('querystring').parse(req.headers['cookie'], '; ')
    return obj[key]
  }
  let cookies = []
  res.setCookie = function(key, value, opts={}) {
    let arr = []
    if(opts.httpOnly) {
      arr.push(`httpOnly=true`)
    }
    if(opts.maxAge) {
      arr.push(`max-age=${opts.maxAge}`)
    }
    cookies.push(`${key}=${value}; ${arr.join('; ')}`)
    res.setHeader('Set-Cookie', cookies)
  }
  if(req.url === '/read') {
    let name = req.getCookie('name')
    res.end(name || 'empty')
  } else if(req.url === '/write') {
    // 可以设置同域名下得domain
    // 设置path 一般不会设置  以这个路径开头就可以 path路径
    // expires  304 缓存效果是一样的  expires 绝对的  max-age 多少秒过期
    // httpOnly 不能在客户端获取到
    res.setCookie('name', 'hzi', { httpOnly: true });
    res.setCookie('age', 25)
    // res.setHeader('Set-Cookie', ["name=hzi; httpOnly=true", "age=10"])
    res.end('Write Ok')
  }
}).listen(3000)
```