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