function Vue(options) {
    this._init(options)
}
initMixin(Vue)
renderMixin(Vue)
lifeCycleMixin(Vue)

// -----------
function initMixin(Vue) {
    Vue.prototype._init(options) {
        const vm = this
        vm.$options = mergeOptions(vm.constructor.options, options)
        initState(vm)   // 初始化数据

        if(vm.$option.el) {
            vm.$mounted(vm.$option.el)
        }
    }
    Vue.prototype.$mounted = function(el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        if(!options.render) {
            let template = options.template
            if(!template && el) {
                template = outerHtml
            }
            const render = compileToFunction(template)
            options.render = render
        }
        mountComputed(vm, el)
    }
}

function initState(vm) {
    const opts = vm.$options
    // 顺序：属性 -> 方法 -> data -> 计算属性 -> watch
    if(opts.props){
        initProps(vm)
    }
    if(opts.methods){
        initMethod(vm)
    }
    if(opts.data){
        initData(vm)
    }
    if(opts.computed){
        initComputed(vm)
    }
    if(opts.watch){
        initWatch(vm)
    }
}

function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        }, 
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}

function initData(vm) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data
    for(let key in data) {  // 座一层代理
        proxy(vm, '_data', key)
    }

    observe(data)   // 响应式原理， 吧data数据进行Object.defineProperty进行重新定义
}

function isObject(data) {
    return typeof data === 'Object' && data !== null
}

function observe(data) {
    let isObj = isObject(data)
    if(!isObj) {
        return
    }
    return new Observer(data)
}

function def(data, key, value) {    // 定义不可枚举属性
    Object.defineProperty(data, key, { 
        enumerable: false, 
        configurable: false,   
        value
    })
}

class Observer {
    constructor(value) {
        Object.defineProperty(value, '__ob__', {    
            enumerable: false,  
            configurable: false,   
            value: this
        })
        // 方便劫持数组中使用observerArray方法
        // 不可枚举，防止循环的时候循环该属性，也不可配置，
        def(value, '__ob__', value)

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
defineReactive(data, key, value) {
    let dep = new Dep()
    observe(value)
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
            if(Dep.target) {
                dep.depend(Dep.target)
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

let oldArrayMethods = Array.prototype
let arrayMethods = Object.create(oldArrayMethods)

const methods = [   // 可以改变数组的7种方法
    'push',
    'pop',
    'unshift',
    'shift',
    'reverse',
    'sort',
    'splice'
]

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
        return result
    }
})

function compileToFunction(template) {
    let root = parseHTML(template)
    let code = generate(root)
    let renderFn = new Function(`width(this){return ${code}}`)
    return renderFn
}

// <div id="app"><p>hello {{name}} </p> hello </div>
// _c('div', {id: 'app'}, _c('p', undefined, _v('hello' + _s(name))), _v('hello'))

function () {
    width(this) {
        return _c('div', {id: 'app'}, _c('p', undefined, _v('hello' + _s(name))), _v('hello'))
    }
}