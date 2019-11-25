const http = require('http')
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer()

const map = {
  'hzi_1.cn': 'http://localhost:3000',
  'hzi_2.cn': 'http://localhost:4000'
}

http.createServer((req, res) => {
  proxy.on('proxyRes', function (proxyRes, req, res) {
    var body = [];
    proxyRes.on('data', function (chunk) {
      body.push(chunk);
    });
    proxyRes.on('end', function () {
      body = Buffer.concat(body).toString();
      console.log("res from proxied server:", body);
      res.end("my response to cli");
    });
  });
  proxy.web(req, res, {
    selfHandleResponse : true,
    target: map[req.headers['host']]
  })
}).listen(80)
