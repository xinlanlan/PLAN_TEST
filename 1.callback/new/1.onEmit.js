function Event() {
    this.events = []
}

Event.prototype.on = function(fn) {
    this.events.push(fn)
}

Event.prototype.emit = function(data) {
    this.events.forEach(child => {
        child(data)
    });
}

let event = new Event()
let arr = []

event.on(function(data) {
    arr.push(data)
    console.log(arr)
})

event.emit(1)
event.emit(2)


// ===================================================
let fs = require('fs')
let school = {}

function EventEmitter() {
    this._arr = []
}

EventEmitter.prototype.on = function(fn) {
    this._arr.push(fn)
}

EventEmitter.prototype.emit = function() {
    this._arr.forEach(fn => fn.apply(this, arguments))
}

let newEvent = new EventEmitter()

newEvent.on(function(key, value) {
    school[key] = value
    if(Object.keys(school).length === 2) {
        console.log(school)
    }
})

fs.readFile('./new/name.txt', 'utf-8', function(err, data) {
    if(err) return console.log(err)
    newEvent.emit('name', data)
})

fs.readFile('./new/age.txt', 'utf-8', function(err, data) {
    if(err) return console.log(err)
    newEvent.emit('age', data)
})