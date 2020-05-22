function deepObj(obj, hash = new WeakMap()) {
    if(obj == null) return obj
    if(obj instanceof Date) return new Date(obj)
    if(obj instanceof RegExp) return new RegExp(obj)
    if(typeof obj !== 'object') return obj
    if(hash.has(obj)) return hash.get(obj)
    let cloneObj = new obj.constructor()
    hash.set(obj, cloneObj)
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
            cloneObj[key] = deepObj(obj[key], hash)
        }
    }
    return cloneObj 
}

// let a = {age: 10}
// a.x = a
// let b = deepObj(a)
// console.log(b)
// console.log(a)

let a = { age: 10 }
let b = deepObj(a)
a.age = 1000
console.log(b)
console.log(a)