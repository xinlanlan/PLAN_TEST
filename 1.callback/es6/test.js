function Animal(name) {
    this.name = name
}

Animal.prototype.say = function() {
    console.log('咆哮')
}

function Tiger(name) {
    this.name = name
}



// Tiger.prototype.__proto__ = Animal.prototype

function create(child, parent) {
    let Fn = function() {}
    Fn.prototype = parent.prototype
    child.prototype = new Fn()
    child.prototype.constructor = child
}

create(Tiger, Animal)

Tiger.prototype.eat = function() {
    console.log('吃饭咯')
}

let tiger = new Tiger('贝贝')

console.log(tiger.constructor)
tiger.say()