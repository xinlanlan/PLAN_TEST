### gzip压缩特点
1. 压缩后的文件后缀为.gz
2. 可以压缩也可以解压
3. 如果文件重复性较高，压缩比例会变大

### zlib包的使用
- 两个方法，gzip和gunzip
- 例如：将1.txt压缩为文件1.gz，代码如下
```
const fs = require('fs')
const zlib = require('zlib')

zlib.gzip(fs.readFileSync('./1.txt'), function(err, data) {
  fs.writeFileSync('1.gz', data)
})

```
### 将服务端一个html压缩之后返回客户端示例
```
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
```
<p style="color: red;">注意：在回复中一定要设置Content-Encoding,否则浏览器不知道你是压缩过的代码那么返回的内容将会乱码</p>


