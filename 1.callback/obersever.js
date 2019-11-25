// 观察者模式

// 被观察者要存放在观察者中
// 要提供一个方法，当被观察者发生改变的时候，要执行观察者的一个方法
// 被观察者要绑定观察者

function Subject() {    // 被观察者
    this.observers = [];
    this.state = 'happy';
}
Subject.prototype.attach = function(observer) {
    this.observers.push(observer)
}

Subject.prototype.setState = function(state) {
    this.state = state;
    this.notify()
}

Subject.prototype.notify = function() {
    this.observers.forEach(function(observer) {
        observer.updated()
    })
}


function Observer(name, target) {
    this.name = name
    this.target = target
}
Observer.prototype.updated = function() {
    console.log(`通知${this.name}: 小宝宝当前的是${this.target.state}`);
}

let subject = new Subject()
let observer1 = new Observer('爸爸', subject);
let observer2 = new Observer('妈妈', subject);

subject.attach(observer1)
subject.attach(observer2)

subject.setState('every happy');
subject.setState('unhappy');    // 观察者是有关系的  基于发布订阅