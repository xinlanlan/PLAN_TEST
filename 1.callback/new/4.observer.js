class Subject {
    constructor() {
        this.state = '开心'
        this.arr = []
    }
    attach(observer) {
        this.arr.push(observer)
    }
    setState(state) {
        this.state = state
        this.arr.forEach(observer => observer.update(state))
    }
}

class Observer {
    constructor(who) {
        this.who = who
    }
    update(state) {
        console.log(`通知${this.who}被观察者的状态为${state}`)
    }
}

let subject = new Subject()
let observer1 = new Observer('爸爸')
let observer2 = new Observer('妈妈')
subject.attach(observer1)
subject.attach(observer2)

subject.setState('不开心')