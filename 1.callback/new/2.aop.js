Function.prototype.before = function(callback) {
    let $this = this
    return function() {
        callback()
        $this.apply($this, arguments)
    }
}

let fn = function (...value) {
    console.log('然后', value)
}

let newFn = fn.before(function() {
    console.log('洗漱')
})

newFn('去', '上班')