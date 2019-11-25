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
        return res.end(`${query.callback}('a=1')`)
      }
      res.statusCode = 404
      res.end('Not Found')
    })
  }
}).listen(3000)