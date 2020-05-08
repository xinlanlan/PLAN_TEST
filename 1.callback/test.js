function Company() {
    this.observers = []
    this.state = '放假'
}

Company.prototype.attach = function(observer) {
    this.observers.push(observer)
}

Company.prototype.setState = function(state) {
    if(this.state === state) {
        return
    }
    this.state = state
    this.observers.forEach(observer => observer.update(state))
}

function Staff(name) {
    this.name = name
}
Staff.prototype.update = function(state) {
    console.log(`通知${this.name}：公司得状态为${state}`)
}

let company = new Company()
let observer1 = new Staff('number1')
let observer2 = new Staff('number2')

company.attach(observer1)
company.attach(observer2)
company.setState('复工')