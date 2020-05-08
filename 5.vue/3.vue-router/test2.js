function lifeCycleMixin(Vue) {
    Vue.prototype._update = function(vnode) {
        const vm = this
        vm.$el = patch(vm.$el, vnode)
    }
}

function mountComputed(vm, el) {
    const options = vm.$options
    vm.$el = el

    // Watcher是用来渲染的
    // vm._render() 通过解析的render方法，渲染虚拟dom
    // vm._updated() 通过虚拟dom渲染真实dom

    callHook(vm, 'beforeMount')
    // 渲染页面
    let updateComputed = () => {
        vm._updated(vm._render)
        
    }
    new Watcher(vm, updateComputed, () => {}, true) // true表示他是一个渲染watcher
    callHook(vm, 'Mounted')
}


function renderMixin(Vue) {
    Vue.prototype._c = function() {
        return createElement(...arguments)
    }
    Vue.prototype._v = function(text) {
        return createTextNode(text)
    }
    Vue.prototype._s = function(val) {
        return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
    }
    Vue.prototype._render = function() {
        const vm = this
        const {render} = vm.$options
        let vnode = render.call(vm) // 返回虚拟节点
        
        return vnode
    }
}


function patch(oldVnode, vnode) {
    const isRealElement = oldVnode.nodeType
    if(isRealElement) {
        const oldElm = oldVnode
        const parentElm = oldElm.parent
        let el = createElm(vnode)
        parentElm.insertBefore(el, oldElm.nextSibling)
        parentElm.removeChild(oldElm)
    }
}

function createElm(vnode) {
    let {tag, children, key, data, text} = vnode

    if(typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        updateProperties(vnode)
        children.forEach(child => {
            return vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function updateProperties(vnode) {
    let newProps = vnode.data || {}
    let el = vnode.el
    for(let key in newProps) {
        if(key === 'style') {
            for(let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if(key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps)
        }
    }
}


function initGlobalAPI(Vue) {
    Vue.options = {}
    Vue.mixin = function(mixin) {
        this.options = mergeOptions(this.options, mixin)
    }
    // 生命周期的合并策略
    Vue.mixin({
        beforeCreate() {

        }
    })
}

function mergeOptions(parent, child) {
    const options = {}
    for(let key in parent) {
        mergeField(key)
    }
    for(let key in child) {
        if(!parent.hasOwnProperty(key)) {
            mergeField(key)
        }
    }
    function mergeField(key) {
        // 如果是生命周期的需要放到数组中
        if(strate[key]) {
            return options[key] = strate[key](parent[key], child[key])
        }
        if(typeof parent[key] === 'object' && typeof child[key] === 'object') {
            options[key] = {
                ...parent[key],
                ...child[key]
            }
        } else if(child[key] == null) {
            options[key] = parent[key]
        } else {
            options[key] = child[key]
        }
    }
    return options
}



const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]

let strate = {}
LIFECYCLE_HOOKS.forEach(hook => {
    strate[hook] = mergeHook
})

function mergeHook(parentVal, childVal) {
    if(childVal) {
        if(parentVal) {
            return parentVal.concat(childVal)
        } else {
            return [childVal]
        }
    } else {
        return parentVal
    }
}

function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if(handler) {
        for(let i = 0; i < handler.length; i++){
            handlers[i].call(vm)
        }
    }   
}