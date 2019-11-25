// 异步函数都无法try catch
// fs是node的一个核心模块，在nodeAPI中所有的回调的第一个参数都是err
// runcode运行时相当于根目录

let fs = require('fs')

function after(times, callback) {
    let arr = [];
    return function(data) {
        arr.push(data)
        if(--times == 0) {
            callback(arr)
        }
    }
}

fs.readFile('./age.txt', 'utf8', function(err, data) {
    fn(data)
})

fs.readFile('./name.txt', 'utf8', function(err, data) {
    fn(data)
})

var fn = after(2, function(data) {
    console.log(data)
})

// 计数的方法解决，还可以进行发布订阅的方式解决