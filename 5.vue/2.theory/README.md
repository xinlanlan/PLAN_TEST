### Vue 的两大核心点MVVM和DOM-diff
- vue中如何实现数据劫持
    1. 遍历data的时候使用Object.keys()，不能用for in(会遍历原型上的属性)
    2. vm.msg 是通过代理 vm._data.msg得到的
    ```
    for(let key in data) {
        proxy(vm, '_data', key)
    }
    function proxy(vm, source, key) {
        Object.defineProperty(vm, key, {
            get() {
                return vm[source][key]
            }
            set(newValue) {
                vm[source][key] = newValue
            }
        })
    }
    ```
    3. render为什么是一个函数，是因为防止单个组件多次引用的时候
    4. Object.create()
    5. vm.$set 内部调用的就是数组的splice方法
- 数组的劫持
- 编译文本
    1. vue2中是组件级别更新，如果数据变了，整个组件刷新
    2. 每一个watcher都有一个唯一的id
    3. getter就是new Watcher()传入的第二个参数(是一个函数) 
- vue中的观察者模式， 发布订阅模式
    1. 使用了发布订阅模式
    2. 依赖收集，收集的是一个个的watcher
    3. dep的作用就是存放一个个的watcher,dep(发布订阅)
    4. vue2.0就是一个组件对应一个watcher
- 计算属性和watch的区别(原理)
    1. watch得实现，其实也是watcher，传入得属性加个用户自定义得参数在里面
    2. 计算属性也是一个watcher，计算属性得watcher加了一个参数是{lazy: true},特点：默认不执行，等用户取值得时候执行，并且会缓存取值得结果，如果依赖得值发生变化，会更新dirty属性，再次取值时，会重新求值

- vue中的批量更新
    1. 每次更改会调用observe里面的set方法，然后会调用notify方法进行更新，为了防止频繁更改，我们要进行批量更新
    2. 批量跟新就是将一个个的watcher存起来，nextTick后进行异步统一更新
- nextTick原理
    1. 就是根据浏览器的兼容性使用了promise或者MutationObserver或者setImmediate或者setTimeout来批量更新出入的callback函数进行延迟执行
- 什么是虚拟dom以及虚拟dom作用
    1. 表示一个节点得对象
    ```
    {
        tag: 'div',
        props: {},
        children: [
            {
                tag: undefined,
                props: undefined,
                children: undefined
            }
        ]
    }
    ```
    2. 虚拟节点和真实节点之间得联系`vnode.el = document.createElement(tag)`
    3. 虚拟dom属性少，并且可以进行节点比对，并且重新渲染次数少
    4. 虚拟节点给真实节点赋属性得时候分几种情况，有的属性直接添加。像style, on, class等属性需要单独处理
- patch 对比
    1. 标签如果不一样，直接替换掉`oldVnode.el.parentNode.replaceChild(createElement(newVnode), oldVnode.el)`
    2. 如果是文本节点，替换掉内容`oldVnode.el.textContent = newVnode.text`
    3. 标签一样属性不一样`let el = newVnode.el = oldVnode.el; updateProperties(newVnode, oldVnode.props)`
    4. 必须有一个根节点，比较孩子
    ```
    let oldChildren = oldVnode.children || []
    let newChildren = newVnode.children || []
    // 新老都有孩子
    if(oldChildren.length > 0 && newChildren.length > 0) {
        updateChildren(el, oldChildren, newChildren)
    // 老的没孩子，新的有孩子
    } else if(oldChildren.length > 0) { 
        el.innerHTML = ''
    // 新的有孩子，老的没孩子
    } else if(newChildren.length > 0) {
        for(let i = 0; i < newChildren.length; i++) {
            let child = children[i]
            el.appendChild(createElement(child))
        }
    }

    ```
- 循环得时候为什么尽量不要使用索引作为key
    1. 比如倒序，本来可以移动完成得, 可能会导致重新创建当前元素得所有子元素  
- vue中diff实现
- 为什么不建议用delete删除属性，而是用vm.$delete
- 数组索引的变化可以检测到，但是因为性能问题，所以没有做
- 为什么el不能是body或者是documentElement，因为内部会先copy一份，把之前得删掉

### v-for 和 v-if不建议连用
- v-for的优先级更高，所以每次循环都会进行v-if的判断，并且这个时候使用v-else可能会出现问题，建议使用template包起来，在外层使用v-if
- 如果想每个数据进行判断，可以使用计算属性过滤掉
### 用vnode来描述一个dom结构
```
<div id="container"><p></p></div>

let obj = {
    tag: 'div',
    props: {
        id: 'container'
    },
    children: [
        {
            tag: 'p',
            data: {},
            children: []
        }
    ]
}
render() {
    return _c('div', {id: 'container'}, _c('p', {}))
}


function createElement(tag, data, ...children) {
    let key = data.key
    delete data.key
    children = children.map(child => {
        if(typeof child === 'object') {
            return child
        } else {
            return vnode(undefined, undefined, undefined, undefined, child)
        }
    })
    return vnode(tag, props, key, children)
}

export function vnode(tag, props, key, children, text) {
    return {
        tag,
        props,
        key,
        children,
        text
    }
}

// 会将template => ast语法树 => 转化为render函数 => 内部调用_c方法 => 转化为虚拟dom
```

### diff算法的时间复杂度
- 两个树的完全的diff算法是一个时间复杂度为O(n3),vue进行了优化，将复杂度转化为O(n) 只比较同级，在前端中很少会跨层级的移动dom元素，所以虚拟dom只会对同一个层级的元素进行比较

### 简述vue中diff算法原理
- 先同级比较，在比较子节点
- 先判断以放有儿子一方没儿子的情况
- 比较都有儿子的情况
- 递归比较子节点
- 最复杂就是都有儿子的情况，vue的采用的时双指针比较
