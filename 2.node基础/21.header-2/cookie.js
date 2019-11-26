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
    res.setCookie('name', 'hzi', { httpOnly: true });
    res.setCookie('age', 25)
    res.end('Write Ok')
  }
}).listen(3000)