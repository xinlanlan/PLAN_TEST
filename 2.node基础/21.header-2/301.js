const http = require('http')

http.createServer((req, res) => {
  let agent = req.headers['user-agent']
  res.statusCode = 302
  if(agent.match(/iPhone/)) {
    res.setHeader('Location', 'https://www.baidu.com')
  } else {
    res.setHeader('Location', 'https://juejin.im/')
  }
  res.end()
}).listen(3000)