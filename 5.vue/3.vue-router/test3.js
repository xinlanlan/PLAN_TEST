let id = 0;
class Watcher{
    constructor(vm, exprOrFn, callback, options) {
        this.vm = vm
        this.callback = callback
        this.options = options
        this.id = id++
        this.getter = exprOrFn
        this.depsId = new Set()
        this.deps = []
        this.get()  // 调用get方法，会让渲染watcher执行
    }
    addDep(dep) {
        let id = dep.id
        if(!this.depsId.has(id)){
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
    get() {
        pushTarget(this)    // 吧watcher执行
        this.getter()   // 渲染watcher执行
        popTarget() // 溢出watcher
    }
    update() {
        this.get()
    }
}

let id = 0;
class Dep {
    constructor() {
        this.id = id++
        this.subs = []
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
    depend() {
        Dep.target.addDep(this)
    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}

let stack = []

function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(watcher)
}

function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}

function observe(data) {
    let isObj = isObject(data)
    if(!isObj) {
        return
    }
    return new Observer(data)
}

class Observer {
    constructor(value) {
        this.dep = new Dep()
        // 方便劫持数组中使用observerArray方法
        // 不可枚举，防止循环的时候循环该属性，也不可配置，
        def(value, '__ob__', value) // 下文会用到__ob__
        
        if(!Array.isArray(value)) {
            this.walk(value)
        } else {    // 对数组进行处理
            value.__proto__ = arrayMethods // 对数组的方法进行改造从而可以进行数组的劫持
            this.observerArray(value)
        }
    }
    walk(data) {
        let keys = Object.keys(data)
        keys.forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
    observerArray(value) {  // 如果数组中又对象， 并对内部进行监控
        for(let i = 0; i < value.length; i++) {
            observe(value[i])
        }
    }
}

function defineReactive(data, key, value) {
    let dep = new Dep()
    let childObj = observe(value)
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
            if(Dep.target) {
                dep.depend(Dep.target)
                if(childObj) {
                    childObj.dep.depend()
                    if(Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newValue) {
            if(newValue === value) return
            observe(newValue)
            value = newValue
            dep.notify()
        }
    })    
}

function dependArray(value) {
    for(let i = 0; i < value.length; i++) {
        let current = value[i]
        current.__ob__ && current.__ob__.dep.depend()
        if(Array.isArray(current)) {
            dependArray(current)
        }
    }
}


methods.forEach(method => {
    arrayMethods[method] = function(...args) {
        const result = oldArrayMethods[method].apply(this, args)
        let inserted;
        let ob = this.__ob__;
        switch(method) {    // 添加的元素可能还是一个对象
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':  // arr.splice(0, 1, {name: 'xxx'})
                inserted = args.splice(2)
            default: 
                break;
        }
        if(inserted) ob.observerArray(inserted)
        ob.dep.notify()
        return result
    }
})