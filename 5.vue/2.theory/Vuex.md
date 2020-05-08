### vue.use(vuex)
- vue的use方法默认会调用插件的install方法，并且会将vue构造函数传递过去，所以插件需要暴漏一个install方法
- 将vue的构造函数传递过去之后，不会讲$store属性放到原型上，因为这样的话会给所有的实例增加store，但是只想给当前的实例或者组件使用这个$store

### vuex的一些注意事项
- 设置strict:true 在严格模式下，不能mutations中使用异步，例如setTimeout等
- api
    1. state 状态
    2. mutations 通过commit触发mutations中的方法，同步改变状态使用
    3. actions  通过dispatch触发actions中的方法，异步改变状态
    4. getter   就像vue中computed计算属性进行使用

### Vuex的原理
- state的实现
```
class Store {
    constructor(options) {
        this.vm = new Vue({
            data: {
                state: options.store
            }
        })
    }
    get state() {   // 获取实例上的state属性就会执行此方法
        return this.vm.state
    }
}

const install =  (_Vue) => {
    Vue = _Vue
    Vue.mixin({
        beforeCreated() {
            if(this.$options.store) {   // 根实例
                this.$store = this.$options.store
            } else {
                this.$store = this.$parent && this.$parent.$store
            }
        }
    })
} 


export default {
    Store,
    install
}
```
### vuex得模块收集实现

### vuex得模块安装

### vuex动态创建模块

### 命名空间

### 辅助函数 (插件) 

### 写个持久化插件 (注意replaceState得坑)

### 映射函数 
- mapState
- maoGetters

### 监控异步变化