const fs = require('fs')
const http = require('http')
const zlib = require('zlib')

http.createServer((req, res) => {
  if(req.url === '/index.html') {
    let headers = req.headers['accept-encoding']
    res.setHeader('Content-Type', 'text/html;charset=utf-8')
    if(headers.match(/\bgzip\b/)) {
      res.setHeader('Content-Encoding', 'gzip')
      fs.createReadStream('./index.html').pipe(zlib.createGzip()).pipe(res)
    } else if(headers.match(/\bdeflate\b/)) {
      res.setHeader('Content-Encoding', 'deflate')
      fs.createReadStream('./index.html').pipe(zlib.createDeflate()).pipe(res)
    } else {
      fs.createReadStream('./index.html').pipe(res)
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}).listen(3000)
