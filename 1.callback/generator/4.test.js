let fs = require('mz/fs')

async function read() {
    try{
        let r = await fs.readFile('./name.txt', 'utf-8')
        let age = await fs.readFile(r, 'utf-8')
        let e = await [age]
        return e
    }catch(e) {
        console.log(e)
    }
}

read().then(data => {
    console.log(data)
}).catch(e => {
    console.log(e)
})