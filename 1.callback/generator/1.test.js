let obj = {0:1, 1:2, 2:3, length:3, [Symbol.iterator]:function* () {
    let index = 0
    while(index !== this.length) {
        yield this[index++]
    }
}}

console.log([...obj])   // [ 1, 2, 3 ]