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

module.exports = Promise