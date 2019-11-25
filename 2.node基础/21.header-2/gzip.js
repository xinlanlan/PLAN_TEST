const fs = require('fs')
const zlib = require('zlib')

zlib.gzip(fs.readFileSync('./1.txt'), function(err, data) {
  fs.createWriteStream('1.gz', data)
})
