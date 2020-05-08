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