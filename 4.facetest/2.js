const http = require('http')
http.createServer((req, res) => {
    res.statusCode = 302
    res.setHeader('Location', 'http://www.baidu.com')
    res.end()
}).listen(3000)