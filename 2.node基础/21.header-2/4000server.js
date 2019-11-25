const http = require('http')

http.createServer((req, res) => {
  res.end('4000 server')
}).listen(4000)