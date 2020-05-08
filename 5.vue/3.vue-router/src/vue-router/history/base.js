export function createRoute(record, location) {
    let res = []

    if(record) {
        while(record) {
            res.unshift(record)
            record = record.parent
        }
    }

    return {
        ...location,
        matched: res
    }
}

function runQueue(queue, iterator, callback) {
    function step(index) {
        if(index === queue.length){
            return callback()
        } 
        let hook = queue[index]
        iterator(hook, () => step(++index))
    }
    step(0)
}

class History {
    constructor(router) {
        this.router = router
        this.current = createRoute(null, {
            path: '/'
        })
    }
    transitionTo(location, callback) {
        let r = this.router.match(location)
        if(location === this.current.path && r.matched.length === this.current.matched.length) {
            return 
        }
        callback && callback()
        let queue = this.router.beforeEachs
        let iterator = (hook, next) => {
            hook(r, this.current, next)
        }
        runQueue(queue, iterator, () => {
            this.updateRoute(r)
        })
    }
    updateRoute(r) {
        this.current = r
        this.cb && this.cb(r)
    }
    setupListener() {
        window.addEventListener('hashchange', () => {
            this.transitionTo(window.location.hash.slice(1))
        })
    }
    listen(cb) {
        this.cb = cb
    }
}

export default History