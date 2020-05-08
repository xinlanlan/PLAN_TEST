// function add(a, b, c) {
//     return a + b + c
// }

// function curry(fn, ...args) {
//     let len = fn.length
//     return function(...arr) {
//         arr = [...arr, ...args]
//         if(arr.length < len) {
//             return curry.apply(this, [fn, ...arr])
//         }
//         return fn.apply(this, arr)
//     }
// }

// let _add = curry(add)
// console.log(_add(1,2))
// console.log(_add(1)(2)(3))
function add() {
    let args = [].slice.call(arguments)
    let adder = () => {
        let _adder = (..._args) => {
            args = [...args, ..._args]
            return _adder
        }
        _adder.toString = () => {
            return args.reduce(function(a,b) {
                return a + b
            })
        }
        return _adder
    }
    return adder()
}

var a = add(1)(2)(3)(4);   // f 10
var b = add(1, 2, 3, 4);   // f 10
var c = add(1, 2)(3, 4);   // f 10
var d = add(1, 2, 3)(4);   // f 10

console.log(a + 10); // 20
console.log(b + 20); // 30
console.log(c + 30); // 40
console.log(d + 40); // 50
