let path = require('path')
let http = require('http')
let url = require('url')

http.createServer((req, res) => {
  let {pathname} = url.parse(req.url, true)
  console.log(pathname)
  res.end()
}).listen(3000)