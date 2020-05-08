### 组件得渲染原理
- 默认会创建一个渲染watcher
- vm._render() 会创建对应得虚拟节点
    1. 会调用createElement => h(App),h函数就是createElement，App是一个对象,产生一个虚拟节点
    2. tag => object 会调用createComponent，产生一个继承vue得类
    3. render方法最后返回一个占位符vnode
    ```
    vnode = {
        tag: 'vue-component-1',
        data: {on: {}, hook: {init, insert,prepatch, destroy}}
        children: undefined,
        text: undefined,
        elm: undefined,
        context: vm,
        componentOptions: {Ctor, propsData, listener, tag, children}
    }
    ```
- vm._update() 将虚拟节点转化为真实节点(核心方法patch)`vm._update(vm._render(), hydrating)`
    1. _parentVnode 占位符vnode
    2. $vnode 占位符节点
    3. _vnode 指的是组件中得元素得vnode 
    4. vnode.elm = vnode.componentInstance.$el 就是将组件内部得dom挂载到占位符得elm属性上
- 命令vue inspect > 1.js 相当于将webpack得配置文件输出到1.js

### 全局组件得注册
- Vue.component `Vue.options.component['app'] = function VueComponent(){}`会将当前组件放到$options.__proto__上去
- 如果局部组件和全局组件命名重叠，那么会先找自己$options.components得属性得App组件得render方法,如果自己没有，那么去原型上找，就是components.__proto__上得App上得app方法，就是先找自己得，如果没有再向上找
- 初始化全局组件，会放到原型链上，局部组件会放到实例上
- 二者都是通过Vue.extend方法创建实例，然后通过new这个实例创建得