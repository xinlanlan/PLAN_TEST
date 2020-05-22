class Promise {
    constructor(executor) {
        this.status = 'pending'
        this.value = undefined
        this.reason = undefined
        this.onResolveCallbacks = []
        this.onRejectedCallbacks = []
        let resolve = (value) => {
            if(value instanceof Promise) {
                return value.then(resolve, reject)
            }
            if(this.status === 'pending') {
                this.value = value
                this.status = 'fulfilled'
                this.onResolveCallbacks.forEach(fn => fn())
            }
        }
        let reject = (reason) => {
            if(this.status === 'pending') {
                this.reason = reason
                this.status = 'rejected'
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try{
            executor(resolve, reject)
        }catch(e) {
            reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === 'fulfilled') {
                setTimeout(() => {
                    try{
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    }catch(e) {
                        reject(e)
                    }   
                });
            }
            if (this.status === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            }
            if(this.status === 'pending') {
                this.onResolveCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    });
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    });
                })
            }
        })
        return promise2
    }
    catch(failCallback) {
        return this.then(null, failCallback)
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
                    if (called) return
                    called = true
                    reject(r)                    
                })
            } else {
                resolve(x)
            }
        }catch(e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {    
        resolve(x)
    }
}

Promise.resolve = (value) => {
    return new Promise((resolve, reject) => {
        resolve(value)
    }) 
}

Promise.reject = (reason) => {
    return new Promise((resolve, reject) => {
        reject(reason)
    })
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