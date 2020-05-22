let Vue;

let forEach = (obj, callback) => {
    Object.keys(obj).forEach(key => {
        callback(key, obj[key])
    })
}

function getState(store, path) {
    let local = path.reduce((newState, current) => {
        return newState[current]
    }, store.state)
    return local
}

function installModule(store, rootState, path, rawModule) {
    let getters = rawModule._raw.getters
    let root = store.modules.root
    if(path.length > 0) {
        let parentState = path.slice(0, -1).reduce((root, current) => {
            return root[current]
        }, rootState)
        Vue.set(parentState, path[path.length-1], rawModule.state)
    }
    let namespaced = path.reduce((str, current) => {
        root = root._children[current]
        str += root._raw.namespaced ? current + '/' : ''
        return str
    }, '')

    if(getters) {
        forEach(getters, (getterName, value) => {
            Object.defineProperty(store.getters, namespaced+getterName, {
                get: () => {
                    return value(getState(store, path))
                }
            })
        });
    }
    let mutations = rawModule._raw.mutations
    if(mutations) {
        forEach(mutations, (mutationName, value) => {
            let arr = store.mutations[namespaced+mutationName] || (store.mutations[namespaced+mutationName] = [])
            arr.push((payload) => {
                value(getState(store, path), payload)
                store.subs.forEach(fn => fn({type: namespaced+mutationName, payload: payload}, store.state))
            })
        })
    }
    let actions = rawModule._raw.actions
    if(actions) {
        forEach(actions, (actionName, value) => {
            let arr = store.actions[namespaced+actionName] || (store.actions[namespaced+actionName] = [])
            arr.push((payload) => {
                value(store, payload)
                store.subsAction.forEach(fn => fn({type: namespaced+actionName, payload: payload}, store.state))
            })
        })
    }
    forEach(rawModule._children, (moduleName, rawModule) => {
        installModule(store, rootState, path.concat(moduleName), rawModule)
    })
}

class ModuleCollection {
    constructor(options) {
        this.register([], options)
    }
    register(path, rootModule) {
        let rawModule = {
            _raw: rootModule,
            _children: {},
            state: rootModule.state
        }
        rootModule.rawModule = rawModule
        if(!this.root) {
            this.root = rawModule
        } else {
            let parentModule = path.slice(0, -1).reduce((root, current) => {
                return root._children[current]
            }, this.root)
            parentModule._children[path[path.length-1]] = rawModule
        }
        if(rootModule.modules) {
            forEach(rootModule.modules, (moduleName, module) => {
                this.register(path.concat(moduleName), module)
            })
        }
    }
}

class Store {
    constructor(options) {
        this.strict = options.strict || false
        this._committing = false
        this.vm = new Vue({
            data: {
                state: options.state
            }
        })
        this.getters =  {}
        this.mutations = {}
        this.actions = {}
        this.subs = []
        this.subsAction = []
        this.modules = new ModuleCollection(options)
        installModule(this, this.state, [], this.modules.root)
        let plugins = options.plugins
        plugins.forEach(fn => fn(this))

        this.vm.$watch(() => {
            return this.vm.state
        },() => {
            console.assert(this._committing, '不能异步调用')
        }, {deep: true, sync: true})
    }
    get state () {
        return this.vm.state
    }
    _widthCommit(fn) {
        const committing = this._committing
        this._committing = true
        fn()
        this._committing = committing
    }
    subscribe(fn) {
        this.subs.push(fn)
    }
    replaceState(state) {
        this._widthCommit(() => {
            this.vm.state = state
        })
    }
    subscribeAction(fn) {
        this.subsAction.push(fn)
    }
    commit = (mutationName, payload) => {
        this._widthCommit(() => {
            this.mutations[mutationName].forEach(fn => fn(payload))
        })
    }
    dispatch = (actionName, payload) => {
        this.actions[actionName].forEach(fn => fn(payload))
    }
    registerModule(path, module) {
        if(!Array.isArray(path)) {
            path = [path]
        }
        this._widthCommit(() => {
            this.modules.register(path, module)
            installModule(this, this.state, path, module.rawModule)
        })
    }
}

const install = (_Vue) => {
    Vue = _Vue
    Vue.mixin({
        beforeCreate() {
            if(this.$options.store) {
                this.$store = this.$options.store
            } else {
                this.$store = this.$parent && this.$parent.$store
            }
        }
    })

}

export const mapState = (stateArr) => {
    let obj = {}
    stateArr.forEach(stateName => {
        obj[stateName] = function() {
            return this.$store.state[stateName]
        }
    })

    return obj
}

export const mapGetters = (stateArr) => {
    let obj = {}
    stateArr.forEach(stateName => {
        obj[stateName] = function() {
            return this.$store.getters[stateName]
        }
    })

    return obj
}

export const mapMutations = (obj) => {
    let res = {}
    Object.entries(obj).forEach(([key, value]) => {
        res[key] = function(...args) {
        this.$store.commit(value, ...args)
        }
    });
    return res
}

export const mapActions = (obj) => {
    let res = {}
    Object.entries(obj).forEach(([key, value]) => {
        res[key] = function(...args) {
        this.$store.dispatch(value, ...args)
        }
    });
    return res
}

export default {
    Store,
    install
}