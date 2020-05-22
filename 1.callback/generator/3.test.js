let fs = require('mz/fs')
// let co = require('co')

function* read() {
    let r = yield Promise.resolve(100)
    let age = yield Promise.resolve(r)
    let e = yield age
    return e
}

function co(it) {
    return new Promise((resolve, reject) => {
        function next(val) {
            let {value, done} = it.next(val)
            if(done) {
                return resolve(value)
            }
            Promise.resolve(value).then(data => {
                next(data)
            }, reject)
        }
        next()
    })
}

co(read()).then(data => {
    console.log(data)
}).catch(e => {
    console.log(e)
})