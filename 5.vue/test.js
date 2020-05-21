var obj = {name: 'June', age: 17, city: 'guangzhou'};
console.log(Object.entries(obj))


new Promise((resolve, reject) => {
    resolve(100)
}).then(val => {
    console.log(val)
    throw Error('12')
}).catch(e => {
    console.log(e)
})