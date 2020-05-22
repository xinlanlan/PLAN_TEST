Vue.prototype.$dispatch = function(eventName, componentName, value) {
    let parent = this.$parent
    while(parent) {
        if(parent.$options.name === componentName) {
            parent.$emit(eventName, value)
            return
        }
        parent = parent.$parent
    }
}

Vue.prototype.$broadcast = function(eventName, componentName, value) {
    let children = this.$children // 获得子组件是一个数组

    function broadcast(children) {
        for(let i = 0; i < children.length; i++) {
            let child = children[i]
            if(componentName === child.$options.name) {
                child.$emit(eventName, value)
            } else {
                if(child.$children) {
                    broadcast(child.$children)
                }
            }
        }
    }
    broadcast(children)
}

Vue.prototype.$bus = new Vue()

// 订阅,可以订阅多次，只要事件名称相同，会依次执行订阅中的回调函数
// {监听事件, [fn, fn]}
this.$bus.on('事件名称', function(args) {
    console.log(args)
})
this.$bus.on('事件名称', function(args) {
    console.log(args)
})
// 发布
this.$bus.$emit('监听事件', 'hello')



['success', 'error', 'warning'].forEach(type => {
    Message[type] = function(options) {
        options.type = type
        return  Message(options)
    } 
});


