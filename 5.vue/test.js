// let root = {
//   value: 1,
//   left: {
//     value: 2,
//     right: {
//       value: 6,
//       left: {
//         value: 10
//       },
//       right: {
//         value: 11
//       }
//     },
//     left: {
//       value: 7,
//       left: {
//         value: 8
//       },
//       right: {
//         value: 9
//       }
//     }
//   },
//   right: {
//     value: 3,
//     right: {
//       value: 4,
//       left: {
//         value: 14
//       },
//       right: {
//         value: 15
//       }
//     },
//     left: {
//       value: 5,
//       left: {
//         value: 12
//       },
//       right: {
//         value: 13
//       }
//     }
//   }
// }
// var arr = []
// function code(root) {
//   if(!root) {
//     return
//   }
//   let stack = []
//   stack.push(root)
//   while(stack.length !== 0) {
//     let tree = stack.shift()
//     arr.push(tree.value)
//     if (tree.right) {
//       stack.push(tree.right)
//     }
//     if (tree.left) {
//       stack.push(tree.left)
//     }
    
//   }
// } 
// code(root)
// console.log(arr)

var a = [{ val: 1 }]
var b = a.map(item => item.val = 2)

// 期望：b 的每一个元素的 val 值变为 2，但最终 a 里面每个元素的 val 也变为了 2
console.log(a[0].val) 
// 其实之前考虑更多的是技术方面的，很多东西从技术角度来说如何更加方便，但是最近感觉工作一定地步应该去吧关心点侧重业务一些，
// 比方说收集用户行为，客户端的问题，如果这种比较薄又比较频繁的业务是否可以通过做一个规范的设计，页面编辑器这之类的

// 每家公司用到的东西都是不一样的，但是我会根据公司当前选型做调整，我觉得这个并不是什么大的问题
