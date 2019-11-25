const http = require('http')
const fs = require('fs')
const size = 3
let start = 0
let flowing = true
process.stdin.on('data', function(data) {
  if(data.toString().includes('p')) {
    flowing = false
  } else {
    flowing = true
    download()
  }
})

function download() {
  http.get({
    host: 'localhost',
    port: 3000,
    headers: {
      Range: `bytes=${start}-${start+size}`
    }
  }, function(res) {
    setTimeout(() => {
      res.on('data', function(chunk) {
        fs.appendFileSync('./3.txt', chunk)
        start += chunk.length
        let total = res.headers['content-range'].split('/')[1]
        if(start < total && flowing) {
          download()
        }
      })
    }, 1000)
  })
}

download()
