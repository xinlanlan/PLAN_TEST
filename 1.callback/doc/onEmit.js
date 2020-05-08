// 发布订阅的模式  例如redux promise eventBus

// 发布订阅的特点  两者无关
// 观察者模式  观察者 ＋ 被观察者  （有关系的）  vue 双向绑定


// 该模式为发布订阅模式（通过一个中介来完成。发布和订阅没有关系，调用发布和调用订阅在哪调用都行，没有太大的关系）
function Event() {
    this.events = []
}

Event.prototype.on = function(fn) {
    this.events.push(fn)
}

Event.prototype.emit = function(data) {
    this.events.forEach(function(fn) {
        fn(data)
    }) 
}

let fs = require('fs');
let event = new Event();
let arr = [];

event.on(function(data) {
    arr.push(data)
    if(arr.length === 2) {
        console.log(arr)
    }
})



fs.readFile('./age.txt', 'utf8', function(err, data) {
    event.emit(data)
})

fs.readFile('./name.txt', 'utf8', function(err, data) {
    event.emit(data)
})