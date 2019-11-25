function after(times, callback) {
    return function() {
        if(--times === 0) {
            callback()
        }
    }
}

var fn = after(2, function() {
    console.log('after·~~')
})

fn()
fn()