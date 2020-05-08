### 实现基本结构
```
function Promise(executor) {
    this.status = 'pending'
    this.value = undefined
    this.reason = undefined
    let self = this
    self.onResolveCallbacks = []
    self.onRejectedCallbacks = []
    function resolve(val) {
        if(self.status === 'pending') {
            self.value = val
            self.status = 'fulfilled'
            self.onResolveCallbacks.forEach(fn => fn());
        }
        
    }

    function reject(reason) {
        if(self.status === 'pending') {
            self.reason = reason
            self.status = 'rejected'
            self.onRejectedCallbacks.forEach(fn => fn());
        }
    }
    try{
        executor(resolve, reject)
    } catch(e) {
        reject(e)
    }
    
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    let self = this

    if(self.status === 'fulfilled') {
        onFulfilled(self.value)
    }

    if(self.status === 'rejected') {
        onRejected(self.reason)
    }

    if(self.status === 'pending') {
        self.onResolveCallbacks.push(function() {
            onFulfilled(self.value)
        })
        self.onRejectedCallbacks.push(function() {
            onRejected(self.reason)
        })
    }
}
```

### 实现链式调用
- 注意，每一个then方法返回都是一个新得promise，并非this
- promise得状态不可更改，一旦成功就不能再失败，一旦失败也不能成功
- 遵循promise规则得测试库，promises-aplus-tests
```
function Promise(executor) {
    this.status = 'pending'
    this.value = undefined
    this.reason = undefined
    let self = this
    self.onResolveCallbacks = []
    self.onRejectedCallbacks = []
    function resolve(val) {
        // 如果resolve得是一个promise
        if(value instanceof Promise) {
            return value.then(resolve, reject)
        }
        if(self.status === 'pending') {
            self.value = val
            self.status = 'fulfilled'
            self.onResolveCallbacks.forEach(fn => fn());
        }
    }

    function reject(reason) {
        if(self.status === 'pending') {
            self.reason = reason
            self.status = 'rejected'
            self.onRejectedCallbacks.forEach(fn => fn());
        }
    }
    try{
        executor(resolve, reject)
    } catch(e) {
        reject(e)
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if(x === promise2) {
        return reject(new TypeError('循环引用'))
    }
    if(x !== null && (typeof x === 'function' || typeof x === 'object')) {
        let called;
        try{
            let then = x.then
            if(typeof then === 'function') {
                then.call(x, y => {
                    if(called) return
                    called = true
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {    
                    if(called) return
                    called = true
                    reject(r)
                })
            } else {
                resolve(x)
            }
        }catch(e) {
            if(called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}
    let self = this
    let promise2 = new Promise(function(resolve, reject) {
        if(self.status === 'fulfilled') {
            setTimeout(() => {
                try{
                    let x = onFulfilled(self.value)
                    resolvePromise(promise2, x, resolve, reject)
                }catch(e) {
                    reject(e)
                }
            })
        }
    
        if(self.status === 'rejected') {
            setTimeout(() => {
                try{
                    let x = onRejected(self.reason)
                    resolvePromise(promise2, x, resolve, reject)
                }catch(e) {
                    reject(e)
                }
            })
        }
    
        if(self.status === 'pending') {
            self.onResolveCallbacks.push(function() {
                setTimeout(() => {
                    try{
                        let x = onFulfilled(self.value)
                        resolvePromise(promise2, x, resolve, reject)
                    }catch(e) {
                        reject(e)
                    }
                })
            })
            self.onRejectedCallbacks.push(function() {
                setTimeout(() => {
                    try{
                        let x = onRejected(self.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    }catch(e) {
                        reject(e)
                    }
                })
            })
        }
    })
    return promise2
}

Promise.deferred = function() {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

module.exports = Promise
```

### Promise得其他方法
- Promise.catch()
```
Promise.prototype.catch = function (failCallback) {
    return this.then(null, failCallback)
}
```
- Promise.finally()

- Promise.resolve()
```
Promise.resolve = function(value) {
    return new Promise((resolve, reject) => {
        resolve(value)
    })
}
```
- Promise.reject()
```
Promise.reject = function(reason) {
    return new Promise((resolve, reject) => {
        reject(reason)
    })
}
```
- Promise.race()
```
Promise.race = function (values) {
    return new Promise((resolve, reject) => {
        for(let i = 0; i < values.length; i++) {
            let current = values[i]
            let then = current.then
            if(then && typeof then === 'function') {
                then.call(current, y=>{
                    resolve(y)
                }, reject)
                //current.then(resolve, reject)
            } else {
                // Promise.resolve(current)
                resolve(current)
            }
        }
    })
}
```
- Promise.all()
```
Promise.all = function (values) {
    return new Promise((resolve, reject) => {
        let arr = []
        let count = 0
        function processData(key, value) {
            arr[key] = value
            if(++count ===  values.length) {
                resolve(arr)
            }
        }
        for(let i = 0; i < values.length; i++) {
            let current = values[i]
            let then = current.then
            if(then && typeof then === 'function') {
                then.call(current, y => {
                    processData(i, y)
                }, reject)
            } else {
                processData(i, current)
            }
        }
    })
}
```
- promisify
```
// 之前
function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}
read('./age.txt').then()
// 之后
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
read('./age.txt', 'utf-8').then()
```

### 实现generator
- 什么是类数组
    1. 有长度，有索引，是个对象 能被迭代


### 缺点和好处
- callback 多个请求并发不好管理 链式调用导致回调过多
- promise 优点优雅处理异步、捕获错误，缺点就是还是嵌套
- generator + co 优点就是让代码像同步， 缺点不支持try catch   
- async + await 可以解决异步问题，而且支持try catch