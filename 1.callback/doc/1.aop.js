// 高阶函数 -- 函数的参数是函数或者函数返回一个函数

// AOP 面向切面编程
// 函数工具库 lodash

Function.prototype.before = function(callback) {
    var that = this;
    return function() {
        callback()
        that.apply(that, arguments);
    }
}

var fn = function (...value) {
    console.log('吃饭', value)
}

var newFn = fn.before(function() {
    console.log('刷牙');
})

newFn('我', '你')

