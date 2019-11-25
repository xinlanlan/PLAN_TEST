// 案例一
setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('成功3')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('成功1')
  setTimeout(() => {
    console.log('timer2')
  }, 0)
})

Promise.resolve().then(() => {
  console.log('成功2')
})

// 案例二
setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    new Promise((resolve, reject) => {
      resolve()
    }).then(() => {
      console.log('p4')
      setTimeout(() => {
        console.log('timer3')
      }, 0)
    })
  })
})

Promise.resolve().then(() => {
  console.log('promise1')
  setTimeout(() => {
    console.log('timer2')
  })
})


console.log(Object.keys(process))
console.log(process.platform)