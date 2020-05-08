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
    // 新增addDep方法
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
    update() {// nextTick方法
        // this.get()
        queueWatcher(this)
    }
    run() {
        this.get()
    }
}

let queue = []
let has = {}
function queueWatcher(watcher) {
    const id = watcher.id
    if(has[id] == null) {
        queue.push(watcher)
        has[id] = true
        nextTick(flushSchedularQueue)
    }
}
function flushSchedularQueue() {
    queue.forEach(watcher => watcher.run())
    queue = []
    has = {}
}


let callbacks = []
let waiting = false
function flushCallback() {
    callbacks.forEach(cb => cb())
    waiting = false
    callbacks = []
}
export function nextTick(cb) {
    callbacks.push(cb)
    if(waiting === false) {
        setTimeout(flushCallback, 0)
        waiting = true
    }
}