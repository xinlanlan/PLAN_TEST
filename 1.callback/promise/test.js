function Promise(executor) {
    this.status = 'pending'
    this.value = undefined
    this.reason = undefined
    let self = this
    self.onResolveCallbacks = []
    self.onRejectedCallbacks = []
    function resolve(value) {
        if(value instanceof Promise) {
            return value.then(resolve, reject)
        }
        if(self.status === 'pending') {
            self.value = value
            self.status = 'fulfilled'
            self.onResolveCallbacks.forEach(fn => fn);
        }
    }
    function reject(reason) {
        if(self.status === 'pending') {
            self.value = reason
            self.status = 'rejected'
            self.onRejectedCallbacks.forEach(fn => fn);
        }
    }
    try{
        executor(resolve, reject)
    }catch(e) {
        reject(e)
    }    
}

function resolvePromise(promise2, x, resolve, reject) {
    if(promise2 === x) {
        return reject(new Error('循环引用'))
    }

    if(x !== null && (typeof x === 'object' || typeof x === 'function')) {
        let called
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
    let self = this;
    let promise2 = new Promise(function(resolve, reject) {
        if(self.status === 'fulfilled') {
            setTimeout(function() { 
                try{
                    let x = onFulfilled(self.value)
                    resolvePromise(promise2, x, resolve, reject)
                }catch(e) {
                    reject(e)
                }
            })
        }
        if(self.status === 'rejected') {
            setTimeout(function() { 
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
                setTimeout(function() { 
                    try{
                        let x = onFulfilled(self.value)
                        resolvePromise(promise2, x, resolve, reject)
                    }catch(e) {
                        reject(e)
                    }
                })
                
            })
            self.onRejectedCallbacks.push(function() {
                try{
                    let x = onRejected(self.reason)
                    resolvePromise(promise2, x, resolve, reject)
                }catch(e) {
                    reject(e)
                }
            })
        }
    })
    return promise2
}

Promise.prototype.catch =  function(failCallback) {
    return this.then(null, failCallback)
}

Promise.resolve =  function(value) {
    return new Promise(function(resolve, reject) {
        resolve(value)
    })
}

Promise.reject =  function(reason) {
    return new Promise(function(resolve, reject) {
        reject(reason)
    })
}

Promise.all = function(values) {
    return new Promise(function(resolve, reject) {
        let arr = []
        let count = 0
        function processData(key, value) {
            arr[key] = value
            if(++count === values.length) {
                resolve(arr)
            }
        }
        for(let i = 0; i < values.length; i++) {
            let current = values[i]
            let then = current.then
            if(typeof then === 'function' && then) {
                then.call(current, y => {
                    processData(i, y)
                }, reject)
            } else {
                processData(i, current)
            }
        }
    })
}

Promise.race = function(values) {
    return new Promise(function(resolve, reject) {
        for(let i = 0; i < values.length; i++) {
            let current = values[i]
            let then = current.then
            if(typeof then === 'function' && then) {
                then.call(current, y => {
                    resolve(y)
                }, reject)
            } else {
                // Promise.resolve(current)
                resolve(current)
            }
        }
    })
}

Promise.deferred =  function() {
    let dfd = {}
    dfd.promise =  new Promise(function(resolve, reject){
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}


module.exports = Promise