function sum(a, b) {
    console.log('sum')
    return a + b
}

function toUpper(str) {
    console.log('toUpper')
    return str.toUpperCase()
}

function add(str) {
    console.log('add')
    return str + '-------'
}

let compose = (...fns) => fns.reduce((a, b) => (...args) => a(b(...args))) 

let r = compose(add, toUpper, sum)('fei', '20')
console.log(r)
