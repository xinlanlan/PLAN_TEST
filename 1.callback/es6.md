### Set
- Set 是集合不能存放重复得东西
- 并集
```
let s1 = [1,2,3,4,5]
let s2 = [2,3,4,6,7]
let union = [...new Set([...s1, ...s2])]
console.log(union)
```
- 交集
```
let s1 = [1,2,3,4,5]
let s2 = [2,3,4,6,7];
let intersection = [...new Set(s1)].filter(item => {
    return new Set(s2).has(item)
})
console.log(intersection)
```
- 差集
```
let s1 = [1,2,3,4,5]
let s2 = [2,3,4,6,7];
let diff = [...new Set(s1)].filter(item => {
    return !new Set(s2).has(item)
})
console.log(diff)
```

### Map
- map是有key得, key可以是一个对象

### WeakMap 得key必须是一个对象类型
- 相对于Map是一个若链接，如果Map得key引用得对象得变量别删除了，哪个对象还会被引用不会被垃圾回收，但是WeakMap得key只是一个名字而已，删除就清空了，例如
```
let b = new Map()
let a = {name: 10}
b.set(a, '1234')
a = null
console.log(b)
// b得key(a)所引用得对象不会被回收
// ---------------
let b = new WeakMap()
let a = {name: 10}
b.set(a, '1234')
a = null
console.log(b)
// b得key只是一个名字而已， {name: 10}会被回收
```
### 写一个深拷贝
```
function deepObj(obj, hash = new WeakMap()) {
    if(obj == null) return obj
    if(obj instanceof Date) return new Date(obj)
    if(obj instanceof RegExp) return new RegExp(obj)
    if(typeof obj !== 'function') return obj
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
```

### hasOwnProperty Object.keys() for in 得区别 

### Object.defineProperty 
- configurable writable enumerable value get set
- writable为true得时候get不能使用


### 箭头函数
- 没有this，没有arguments

### proxy

### Array得常用方法
- es5 => forEach reduce filter map some every
    1. reduce
    ```
    // 求和
    let r = [1,2,3,4,5].reduce((a, b) => {
        return a + b
    })
    console.log(r)

    // 对象
        let r = [{price: 10, count: 1},{price: 20, count: 2},{price: 30, count: 3}].reduce((a, b) => {
        return a + b.price * b.count
    }, 0)
    console.log(r)

    // key value
    let keys = ['name', 'age']
    let values = ['fei', 20]
    let r = keys.reduce((a, b, index) => {
        a[b] = values[index]
        return a
    }, {})
    console.log(r)

    // reduceRight  从右向左执行 reduce从左向右执行

    // 实现compose
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

    // function compose(...fns) {
    //     return fns.reduce((a, b) => {
    //         return (...args) => {
    //             return a(b(...args))
    //         }
    //     })
    // }

    // 可以简写
    let compose = (...fns) => fns.reduce((a, b) => (...args) => a(b(...args)))


    let r = compose(add, toUpper, sum)('fei', '20')
    console.log(r)

    // 实现reduce方法
    Array.prototype.reduce = function(callback, prev) {
        for(let i = 0; i < this.length; i++) {
            if(prev == undefined) {
                prev = callback(this[i], this[i+1], i+1, this)
                i++
            } else {
                prev = callback(prev, this[i], i, this)
            }
        }
        return prev
    };
    ```
    
    2. filter, 只要是true就留下
    3. map映射为一个新数组
    4. some只要有true就返回 返回boolean
    5. every 直到有false就返回 返回boolean
    
- es6 => find findIndex
    1. find 找到就返回，返回值为找到得那一项
- es7 => includes

### class 和 原型
- Object.prototype.__proto__ = null
- es6不支持静态属性只支持静态方法，es7支持静态属性
- class A extends B{} A上得静态方法B也可以继承
