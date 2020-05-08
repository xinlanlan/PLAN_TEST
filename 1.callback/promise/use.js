let Promise = require('./3.promise.js')
let fs = require('fs')

// 实现promisify

function promisify(fn) {
    return function () {
        return new Promise((resolve, reject) => {
            fn(...arguments, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }
}

let read = promisify(fs.readFile)

function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}


// let p1 = new Promise((resolve, reject) => {
//     reject('error')
// })


// let p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(200)
//     })
// })

// let p3 = Promise.resolve(300)

// let p4 = new Promise((resolve, reject) => {
//     resolve(400)
// })


Promise.race([Promise.resolve(300), 1]).then(data => {
    console.log(data)
}).catch(e => {
    console.log(e)
})
