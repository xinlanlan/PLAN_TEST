const http = require('http')
const fs = require('fs')
const size = fs.statSync('./2.txt').size

http.createServer((req, res) => {
  let range = req.headers['range']
  console.log(range)
  if(range) {
    let [,start,end] = range.match(/(\d+)-(\d+)/)
    start = Number(start)
    end = Number(end)
    res.statusCode = 206
    res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
    fs.createReadStream('2.txt', {start, end}).pipe(res)
  } else {
    fs.createReadStream('2.txt').pipe(res)
  }

}).listen(3000)