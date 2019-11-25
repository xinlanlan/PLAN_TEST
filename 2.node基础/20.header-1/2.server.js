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