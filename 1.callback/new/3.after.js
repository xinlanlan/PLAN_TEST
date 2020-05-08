function after(times, callback) {
    return function() {
        if(--times === 0) {
            callback()
        }
    }
}

let newFn = after(3, function() {
    console.log('开始执行')
})

newFn()
newFn()
newFn()

// ===================================================
let fs = require('fs')

function after(times, callback) {
    let result = {}
    return function(key, value) {
        result[key] = value
        if(--times === 0) {
            callback(result)
        }
    }
}

let newFn = after(2, function(result) {
    console.log(result)
})

fs.readFile('./name.txt', 'utf-8', function(err, data) {
    if(err) return console.log(err)
    newFn('name', data)
})

fs.readFile('./age.txt', 'utf-8', function(err, data) {
    if(err) return console.log(err)
    newFn('age', data)
})