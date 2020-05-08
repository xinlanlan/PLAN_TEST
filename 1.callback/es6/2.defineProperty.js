function update() {
    console.log('更新视图')
}
let obj = {
    name: 'zf',
    age: 10,
    address: {
        location: '北京'
    }
}

function observer(obj) {
    if(typeof obj !== 'object') return obj

    for(let key in obj) {
        defineReactive(obj, key, obj[key])
    }
}
function defineReactive(obj, key, value) {
    observer(value)
    Object.defineProperty(obj, key, {
        get() {
            return value
        },
        set(val) {
            if(val !== value) {
                observer(val) // 如果重新赋予一个新的对象
                update()
                value = val
            }
        }
    })
}

let methods = ['push', 'pop', 'unshift', 'shift', 'reserve', 'splice', 'sort']

methods.forEach(method => {
    let oldMethod = Array.prototype[method]
    Array.prototype[method] = function() {
        update()
        oldMethod.call(this, ...arguments)
    }
})

observer(obj)
// obj.address.location = '上海'
// obj.address = {
//     location: '上海'
// }
// obj.address.location = '南京'

obj.address = [1,2,3]
obj.address.push(100)